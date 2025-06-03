import Link from 'next/link';

const mockWorkOrders = [
  { 
    id: 'WO-05478926',
    account: 'HH-9134',
    customer: 'Samantha264Long675',
    billingProfile: 'Test-Astro [M-J-S-D]',
    serviceDate: '04/28/2025',
    status: 'Scheduled',
    serviceType: 'Recurring',
    serviceName: 'West Side Residential'
  },
  {
    id: 'WO-05488226',
    account: 'HH-19640',
    customer: 'Stest 20250218/01',
    billingProfile: '51 RO Monthly',
    serviceDate: '04/30/2025',
    status: 'Scheduled',
    serviceType: 'Recurring',
    serviceName: 'Commercial Daily'
  },
  {
    id: 'WO-05495750',
    account: 'HH-18889',
    customer: 'Scott n Eileen',
    billingProfile: 'Residential Monthly',
    serviceDate: '04/30/2025',
    status: 'Scheduled',
    serviceType: 'Recurring',
    serviceName: 'Chicago Residential'
  }
];

export default function BillingPage() {
  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Work orders review</h1>
          <div className="flex gap-2">
            <input 
              type="text" 
              value="04/28/2025 - 04/30/2025"
              className="border rounded px-3 py-1"
              readOnly
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-600">
            <CalendarIcon className="w-5 h-5" />
          </button>
          <button className="text-gray-600">
            <MenuIcon className="w-5 h-5" />
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Create draft invoices
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-4 border-b">
          <button className="text-gray-500 px-4 py-2">Not Ready</button>
          <button className="text-blue-600 px-4 py-2 border-b-2 border-blue-600">Ready</button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <button className="flex items-center gap-2 text-blue-600">
          <FilterIcon className="w-5 h-5" />
          <span>Filters</span>
          <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm">2</span>
        </button>
        <div className="flex gap-2">
          <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
            Service type is Recurring
            <button className="text-gray-500">×</button>
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
            Disposal ticket # is not empty
            <button className="text-gray-500">×</button>
          </span>
        </div>
        <div className="ml-auto">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-3 py-1"
          />
        </div>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr className="border-b">
            <th className="w-8 px-4 py-2">
              <input type="checkbox" />
            </th>
            <th className="px-4 py-2 text-left">WO #</th>
            <th className="px-4 py-2 text-left">Account #</th>
            <th className="px-4 py-2 text-left">Customer</th>
            <th className="px-4 py-2 text-left">Billing profile</th>
            <th className="px-4 py-2 text-left">Service date</th>
            <th className="px-4 py-2 text-left">WO status</th>
            <th className="px-4 py-2 text-left">Service type</th>
            <th className="px-4 py-2 text-left">Service name</th>
          </tr>
        </thead>
        <tbody>
          {mockWorkOrders.map((wo) => (
            <tr key={wo.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">
                <input type="checkbox" />
              </td>
              <td className="px-4 py-2">
                <Link href={`/billing/work-orders/${wo.id}`} className="text-blue-600 hover:underline">
                  {wo.id}
                </Link>
              </td>
              <td className="px-4 py-2">{wo.account}</td>
              <td className="px-4 py-2 text-blue-600">{wo.customer}</td>
              <td className="px-4 py-2">{wo.billingProfile}</td>
              <td className="px-4 py-2">{wo.serviceDate}</td>
              <td className="px-4 py-2">{wo.status}</td>
              <td className="px-4 py-2">{wo.serviceType}</td>
              <td className="px-4 py-2">{wo.serviceName}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4 text-right text-gray-600">
        Total Rows: {mockWorkOrders.length} of 28,155
      </div>
    </div>
  );
}

const CalendarIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const FilterIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);
