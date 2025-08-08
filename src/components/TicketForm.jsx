import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function TicketForm({ onTicketAdded }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    pnr_number: "",
    bus_operator: "",
    source_location: "",
    destination_location: "",
    passenger_name: "",
    departure_time: "",
    departure_date: "",
    seat_number: "",
    ticket_price: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("bus_tickets")
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bus ticket created successfully!",
      });

      // Reset form
      setFormData({
        pnr_number: "",
        bus_operator: "",
        source_location: "",
        destination_location: "",
        passenger_name: "",
        departure_time: "",
        departure_date: "",
        seat_number: "",
        ticket_price: 0,
      });

      onTicketAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating ticket:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "ticket_price" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Bus Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pnr_number">PNR Number</Label>
              <Input
                id="pnr_number"
                name="pnr_number"
                value={formData.pnr_number}
                onChange={handleChange}
                required
                placeholder="e.g., PNR123456"
              />
            </div>
            <div>
              <Label htmlFor="bus_operator">Bus Operator</Label>
              <Input
                id="bus_operator"
                name="bus_operator"
                value={formData.bus_operator}
                onChange={handleChange}
                required
                placeholder="e.g., ABC Travels"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source_location">Source Location</Label>
              <Input
                id="source_location"
                name="source_location"
                value={formData.source_location}
                onChange={handleChange}
                required
                placeholder="e.g., Mumbai"
              />
            </div>
            <div>
              <Label htmlFor="destination_location">Destination Location</Label>
              <Input
                id="destination_location"
                name="destination_location"
                value={formData.destination_location}
                onChange={handleChange}
                required
                placeholder="e.g., Delhi"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="passenger_name">Passenger Name</Label>
            <Input
              id="passenger_name"
              name="passenger_name"
              value={formData.passenger_name}
              onChange={handleChange}
              required
              placeholder="e.g., John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="departure_date">Departure Date</Label>
              <Input
                id="departure_date"
                name="departure_date"
                type="date"
                value={formData.departure_date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="departure_time">Departure Time</Label>
              <Input
                id="departure_time"
                name="departure_time"
                type="time"
                value={formData.departure_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seat_number">Seat Number</Label>
              <Input
                id="seat_number"
                name="seat_number"
                value={formData.seat_number}
                onChange={handleChange}
                required
                placeholder="e.g., A1"
              />
            </div>
            <div>
              <Label htmlFor="ticket_price">Ticket Price</Label>
              <Input
                id="ticket_price"
                name="ticket_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.ticket_price}
                onChange={handleChange}
                required
                placeholder="e.g., 1500.00"
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating..." : "Create Ticket"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}