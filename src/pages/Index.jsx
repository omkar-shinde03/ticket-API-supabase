import { useState } from "react";
import { TicketForm } from "@/components/TicketForm";
import { TicketsList } from "@/components/TicketsList";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTicketAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-black">Bus Ticket API</h1>
          <p className="text-xl text-gray-600">
            Real-time bus ticket management system
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <TicketForm onTicketAdded={handleTicketAdded} />
          </div>
          
          <div className="lg:col-span-1">
            <TicketsList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
