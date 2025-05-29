import Link from "next/link";

export default function DisposalStopsListPage() {
  // Enhanced dummy data
  const stops = [
    { id: "1001", name: "Disposal Stop 1001", address: "123 Main St, San Diego, CA", tickets: 3, lastActivity: "2024-06-01" },
    { id: "1002", name: "Disposal Stop 1002", address: "456 Oak Ave, San Diego, CA", tickets: 1, lastActivity: "2024-05-28" },
    { id: "1003", name: "Disposal Stop 1003", address: "789 Pine Rd, San Diego, CA", tickets: 5, lastActivity: "2024-06-02" },
    { id: "1004", name: "Disposal Stop 1004", address: "321 Maple Blvd, San Diego, CA", tickets: 2, lastActivity: "2024-05-30" },
  ];
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Disposal Stops</h1>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Address</th>
            <th className="px-4 py-2 text-left">Tickets</th>
            <th className="px-4 py-2 text-left">Last Activity</th>
          </tr>
        </thead>
        <tbody>
          {stops.map((stop) => (
            <tr key={stop.id} className="border-t">
              <td className="px-4 py-2">
                <Link href={`/routes/disposal-stops/${stop.id}`} className="text-blue-600 underline">
                  {stop.name}
                </Link>
              </td>
              <td className="px-4 py-2">{stop.address}</td>
              <td className="px-4 py-2">{stop.tickets}</td>
              <td className="px-4 py-2">{stop.lastActivity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 