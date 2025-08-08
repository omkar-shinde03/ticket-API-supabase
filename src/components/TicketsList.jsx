import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Edit, Calendar, Clock, MapPin, User, CreditCard, Hash } from "lucide-react";

export function TicketsList({ refreshTrigger }) {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from("bus_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
        variant: "destructive",
      });
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTicket = async (id) => {
    try {
      const { error } = await supabase
        .from("bus_tickets")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ticket deleted successfully",
      });

      fetchTickets();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete ticket",
        variant: "destructive",
      });
      console.error("Error deleting ticket:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [refreshTrigger]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('bus-tickets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bus_tickets'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchTickets(); // Refresh the list when data changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading tickets...</div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="text-lg text-muted-foreground">No tickets found</div>
          <div className="text-sm text-muted-foreground mt-2">
            Create your first bus ticket using the form above
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bus Tickets ({tickets.length})</h2>
        <Button onClick={fetchTickets} variant="outline" size="sm">
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    {ticket.pnr_number}
                  </CardTitle>
                  <Badge variant="secondary">{ticket.bus_operator}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTicket(ticket.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="font-medium">From:</span>
                    <span>{ticket.source_location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span className="font-medium">To:</span>
                    <span>{ticket.destination_location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Passenger:</span>
                    <span>{ticket.passenger_name}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Date:</span>
                    <span>{new Date(ticket.departure_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Time:</span>
                    <span>{ticket.departure_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Price:</span>
                    <span className="font-bold">₹{ticket.ticket_price}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <div className="text-sm text-muted-foreground">
                  Seat: <span className="font-medium">{ticket.seat_number}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(ticket.created_at).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}