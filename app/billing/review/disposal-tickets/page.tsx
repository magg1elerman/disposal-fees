'use client';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import React from 'react';

const mockTickets = [
  {
    id: '223381',
    image: '/disposal-ticket-example.png',
    type: 'C&D',
    tons: 1,
    rate: '$50/ton',
    minCharge: '$200',
    fee: 200,
    container: null,
    site: 'DUMP SITE NAME',
    created: '01-17-2025 | 05:39 PM',
    source: 'Mobile',
    hasImage: true,
    alerts: 1,
  },
  {
    id: '223381',
    image: '/disposal-ticket-example.png',
    type: '20 Yard Container',
    tons: null,
    rate: null,
    minCharge: null,
    fee: 50,
    container: '20 Yard Container',
    site: 'DUMP SITE NAME',
    created: '01-17-2025 | 05:39 PM',
    source: 'Office',
    hasImage: false,
    alerts: 1,
  },
];

const mockWorkOrders = [
  {
    id: 'WO-04713071',
    date: '01/17/2025',
    service: 'service name 1 | weekly 7x',
    location: 'Location name',
    address: 'Location address',
    status: 'RN',
    statusColor: 'bg-green-200 text-green-800',
    icons: [
      { icon: 'shield', badge: 1 },
      { icon: 'money', badge: 1, value: '$10' },
      { icon: 'image', badge: 1 },
      { icon: 'receipt' },
      { icon: 'ticket' },
      { icon: 'store' },
      { icon: 'clipboard' },
    ],
    chips: [
      { label: 'RN', color: 'bg-green-200 text-green-800' },
      { label: '', color: 'bg-purple-200' },
      { label: '', color: 'bg-yellow-200' },
    ],
  },
  {}, {}, // repeat for demo
];

function WorkOrderPanel({ onClose, visible }: { onClose: () => void; visible: boolean }) {
  return (
    <div
      className={`h-full bg-white border-r shadow flex flex-col min-w-[0px] max-w-[500px] w-full transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none overflow-hidden'}`}
      style={{ width: visible ? undefined : 0 }}
    >
      <div className="flex items-center gap-2 p-4 border-b">
        <Button variant="ghost" size="sm" onClick={onClose}>&larr;</Button>
        <span className="font-semibold text-lg">Work orders</span>
        <div className="flex-1" />
        <Input placeholder="Search.." className="max-w-xs" />
      </div>
      <div className="flex gap-2 px-4 py-2 border-b items-center">
        <Button variant="outline" size="sm">Not ready</Button>
        <Button variant="outline" size="sm">driver</Button>
      </div>
      <div className="overflow-y-auto flex-1 p-2">
        {mockWorkOrders.map((wo, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <a href="#" className="text-blue-600 font-medium hover:underline">{wo.id}</a>
              <span className="text-xs text-gray-500">| {wo.date}</span>
              <span className="ml-auto font-bold">$Total</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-yellow-700"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FACC15" /><rect x="8" y="7" width="8" height="8" rx="2" fill="#fff" /></svg></span>
              <span className="font-medium">{wo.service}</span>
            </div>
            <div className="text-sm text-gray-700">{wo.location}</div>
            <div className="text-xs text-blue-400 mb-1">{wo.address}</div>
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-200 text-green-800">RN</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-200 text-purple-800"><svg width="12" height="12"><circle cx="6" cy="6" r="6" fill="#A78BFA" /></svg></span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800"><svg width="12" height="12"><circle cx="6" cy="6" r="6" fill="#FACC15" /></svg></span>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {/* Icons with badges, for demo use emoji or svg */}
              <span className="relative"><span role="img" aria-label="shield">🛡️</span><span className="absolute -top-2 -right-2 bg-blue-200 text-blue-800 rounded-full px-1 text-xs">1</span></span>
              <span className="relative"><span role="img" aria-label="money">💵</span><span className="absolute -top-2 -right-2 bg-blue-200 text-blue-800 rounded-full px-1 text-xs">$10</span></span>
              <span className="relative"><span role="img" aria-label="image">🖼️</span><span className="absolute -top-2 -right-2 bg-blue-200 text-blue-800 rounded-full px-1 text-xs">1</span></span>
              <span role="img" aria-label="receipt">🧾</span>
              <span role="img" aria-label="ticket">🎫</span>
              <span role="img" aria-label="store">🏪</span>
              <span role="img" aria-label="clipboard">📋</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DisposalTicketsPage() {
  const [workOrderPanelOpen, setWorkOrderPanelOpen] = useState(false);
  const [workOrderPanelSize, setWorkOrderPanelSize] = useState(0); // percent
  const [search, setSearch] = useState('');

  // Hide sidebar nav when work order panel is open
  React.useEffect(() => {
    if (workOrderPanelOpen) {
      document.body.classList.add('hide-billing-sidebar');
    } else {
      document.body.classList.remove('hide-billing-sidebar');
    }
  }, [workOrderPanelOpen]);

  const openWorkOrderPanel = () => {
    setWorkOrderPanelOpen(true);
    setWorkOrderPanelSize(30);
  };
  const closeWorkOrderPanel = () => {
    setWorkOrderPanelOpen(false);
    setWorkOrderPanelSize(0);
  };

  return (
    <div className="h-full w-full">
      <div className="mb-2 flex gap-2">
        {!workOrderPanelOpen && (
          <Button variant="outline" size="sm" onClick={openWorkOrderPanel}>
            Show Work Orders
          </Button>
        )}
      </div>
      <ResizablePanelGroup direction="horizontal" className="h-[80vh] w-full">
        <ResizablePanel
          key={workOrderPanelOpen ? 'open' : 'closed'}
          defaultSize={workOrderPanelOpen ? 30 : 0}
          minSize={0}
          maxSize={50}
          style={{ transition: 'width 0.3s' }}
          className="transition-all duration-300"
        >
          <WorkOrderPanel onClose={closeWorkOrderPanel} visible={workOrderPanelOpen} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          key={workOrderPanelOpen ? 'tickets-open' : 'tickets-closed'}
          defaultSize={workOrderPanelOpen ? 70 : 100}
          minSize={workOrderPanelOpen ? 50 : 100}
          style={{ transition: 'width 0.3s' }}
          className="transition-all duration-300"
        >
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h1 className="text-2xl font-semibold">Disposal tickets</h1>
              <div className="flex gap-2 items-center">
                <Input placeholder="Date range" className="w-56" readOnly value="Start date - End date" />
                <Button className="ml-2">Ready for Invoice</Button>
              </div>
            </div>
            {/* Tabs */}
            <Tabs defaultValue="unprocessed">
              <TabsList className="mb-2">
                <TabsTrigger value="unprocessed">Unprocessed</TabsTrigger>
                <TabsTrigger value="suggested">Suggested match</TabsTrigger>
                <TabsTrigger value="matched">Matched</TabsTrigger>
                <TabsTrigger value="ready">Ready for Invoice</TabsTrigger>
                <TabsTrigger value="invoiced">Invoiced</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              <TabsContent value="unprocessed">
                {/* Filters and search */}
                <div className="flex items-center gap-2 mb-2">
                  <Button variant="outline" size="sm">Value</Button>
                  <Button variant="outline" size="sm">Value</Button>
                  <Button variant="outline" size="sm">Value</Button>
                  <Input
                    placeholder="Search.."
                    className="ml-auto w-64"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                {/* Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><Checkbox /></TableHead>
                      <TableHead></TableHead>
                      <TableHead>Disposal tickets</TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTickets.map((ticket, i) => (
                      <TableRow key={i}>
                        <TableCell><Checkbox /></TableCell>
                        <TableCell>
                          <img src={ticket.image} alt="ticket" className="w-12 h-12 rounded object-cover" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {ticket.type === 'C&D' ? (
                              <Badge>C&D</Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">{ticket.container}</Badge>
                            )}
                            <div className="text-xs text-muted-foreground">#{ticket.id} | {ticket.site}</div>
                          </div>
                          <div className="flex gap-2 text-xs mt-1">
                            {ticket.tons && <span>{ticket.tons} Ton</span>}
                            {ticket.rate && <span>{ticket.rate}</span>}
                            {ticket.minCharge && <span>{ticket.minCharge} min. charge</span>}
                            <span className="font-semibold">${ticket.fee} Disposal Fee</span>
                          </div>
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          Created on {ticket.created}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{ticket.source}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              {/* Other tabs can be filled similarly */}
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
} 