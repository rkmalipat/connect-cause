import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Send, MessageCircle, Users, Search } from "lucide-react";
import type { Message, User } from "@shared/schema";

interface ConversationPreview {
  otherUser: User;
  lastMessage: Message;
  unreadCount: number;
}

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: conversationMessages = [] } = useQuery<Message[]>({
    queryKey: [`/api/conversations/${user?.id}`],
    enabled: !!user,
  });

  const { data: selectedMessages = [] } = useQuery<Message[]>({
    queryKey: [`/api/messages/${user?.id}/${selectedConversation}`],
    enabled: !!user && !!selectedConversation,
  });

  // Get conversations with user details
  const conversationsQuery = useQuery<ConversationPreview[]>({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const conversations: ConversationPreview[] = [];
      const processedUsers = new Set<number>();

      for (const message of conversationMessages) {
        const otherUserId = message.senderId === user.id ? message.receiverId : message.senderId;
        
        if (processedUsers.has(otherUserId)) continue;
        processedUsers.add(otherUserId);

        try {
          const userResponse = await fetch(`/api/users/${otherUserId}`);
          if (userResponse.ok) {
            const otherUser = await userResponse.json();
            
            // Get all messages with this user to find unread count
            const allMessages = conversationMessages.filter(m => 
              (m.senderId === user.id && m.receiverId === otherUserId) ||
              (m.senderId === otherUserId && m.receiverId === user.id)
            );
            
            const unreadCount = allMessages.filter(m => 
              m.senderId === otherUserId && !m.read
            ).length;

            conversations.push({
              otherUser,
              lastMessage: message,
              unreadCount,
            });
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }

      return conversations.sort((a, b) => 
        new Date(b.lastMessage.createdAt!).getTime() - new Date(a.lastMessage.createdAt!).getTime()
      );
    },
    enabled: !!user && conversationMessages.length > 0,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !selectedConversation) throw new Error("Missing requirements");
      
      const messageData = {
        senderId: user.id,
        receiverId: selectedConversation,
        content,
      };

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${user?.id}/${selectedConversation}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/conversations/${user?.id}`] });
      queryClient.invalidateQueries({ queryKey: ["conversations", user?.id] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessageMutation.mutate(newMessage.trim());
    }
  };

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/conversations/${user?.id}`] });
      queryClient.invalidateQueries({ queryKey: ["conversations", user?.id] });
    },
  });

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && selectedMessages.length > 0) {
      const unreadMessages = selectedMessages.filter(m => 
        m.receiverId === user?.id && !m.read
      );
      
      unreadMessages.forEach(message => {
        markAsReadMutation.mutate(message.id);
      });
    }
  }, [selectedConversation, selectedMessages, user?.id]);

  const filteredConversations = (conversationsQuery.data || []).filter(conv =>
    conv.otherUser.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.otherUser.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in required</h1>
            <p className="text-gray-600">Please sign in to view your messages.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Connect and communicate with your supporters and beneficiaries</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Conversations
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  {conversationsQuery.isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading conversations...</div>
                  ) : filteredConversations.length > 0 ? (
                    <div className="space-y-1">
                      {filteredConversations.map((conversation) => (
                        <div
                          key={conversation.otherUser.id}
                          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedConversation === conversation.otherUser.id ? 'bg-trust-blue/10 border-r-4 border-trust-blue' : ''
                          }`}
                          onClick={() => setSelectedConversation(conversation.otherUser.id)}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-trust-blue text-white">
                                {conversation.otherUser.fullName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900 truncate">
                                  {conversation.otherUser.fullName}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <Badge variant="destructive" className="ml-2">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">@{conversation.otherUser.username}</p>
                              <p className="text-sm text-gray-500 truncate">
                                {conversation.lastMessage.content}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {conversation.lastMessage.createdAt && 
                                  new Date(conversation.lastMessage.createdAt).toLocaleDateString()
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      {searchTerm ? 'No conversations found' : 'No conversations yet'}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-trust-blue text-white">
                          {filteredConversations.find(c => c.otherUser.id === selectedConversation)?.otherUser.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {filteredConversations.find(c => c.otherUser.id === selectedConversation)?.otherUser.fullName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          @{filteredConversations.find(c => c.otherUser.id === selectedConversation)?.otherUser.username}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-[calc(100vh-24rem)] p-4">
                      <div className="space-y-4">
                        {selectedMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.senderId === user.id
                                  ? 'bg-trust-blue text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.senderId === user.id ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {message.createdAt && new Date(message.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button 
                        type="submit" 
                        disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        className="bg-trust-blue hover:bg-blue-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
