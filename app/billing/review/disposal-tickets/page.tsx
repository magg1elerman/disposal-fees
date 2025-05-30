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
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

const mockTickets = [
  // Suggested Match
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
    status: 'suggested',
  },
  {
    id: '223382',
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
    status: 'suggested',
  },
  // Unprocessed
  {
    id: '223383',
    image: '/disposal-ticket-example.png',
    type: 'No Sort Recycle',
    tons: 2.5,
    rate: '$60/ton',
    minCharge: '$120',
    fee: 120,
    container: null,
    site: 'UNITED DISPOSAL',
    created: '01-18-2025 | 10:00 AM',
    source: 'Mobile',
    hasImage: true,
    alerts: 0,
    status: 'unprocessed',
  },
  // Matched
  {
    id: '223384',
    image: '/disposal-ticket-example.png',
    type: 'C&D',
    tons: 1.2,
    rate: '$55/ton',
    minCharge: '$110',
    fee: 110,
    container: null,
    site: 'DUMP SITE NAME',
    created: '01-19-2025 | 12:00 PM',
    source: 'Office',
    hasImage: true,
    alerts: 0,
    status: 'matched',
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
  {
    id: 'WO-04713072',
    date: '01/17/2025',
    service: 'service name 2 | weekly 7x',
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
  {
    id: 'WO-04713073',
    date: '01/17/2025',
    service: 'service name 3 | weekly 7x',
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
  }
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
        {mockWorkOrders.map((wo) => (
          <div key={wo.id} className="bg-gray-100 rounded-lg p-4 mb-4 shadow-sm">
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

function TicketRow({ ticket }: { ticket: any }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverHandlers = {
    onMouseEnter: () => setPopoverOpen(true),
    onMouseLeave: () => setPopoverOpen(false),
  };
  return (
    <div className="flex items-center gap-4 py-2 px-2 w-full">
      {/* Checkbox */}
      <Checkbox className="mr-2" />
      {/* Image */}
      <img src={ticket.image} alt="ticket" className="w-14 h-14 rounded object-cover border" />
      {/* Badge, camera, and type */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-red-200 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
            {ticket.type}
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v10a2 2 0 01-2 2H11a2 2 0 01-2-2V10m6 0H9" /></svg>
          </span>
          <span className="text-xs text-blue-500">{ticket.rate ? `${ticket.rate} - 1 min` : ''}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-base">#{ticket.id}</span>
          <span className="font-semibold text-base">| {ticket.site}</span>
          <span className="text-xs text-gray-400">| {ticket.created}</span>
        </div>
      </div>
      {/* Weights and fee */}
      <div className="flex items-center gap-6 flex-shrink-0">
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold">{ticket.tons || '—'}</span>
          <span className="text-xs text-gray-400">Gross</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold">15.1</span>
          <span className="text-xs text-gray-400">Tare</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold">10.2 Lbs</span>
          <span className="text-xs text-blue-400">Net weight</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">${ticket.fee}</span>
          <span className="text-xs text-blue-400">tipping fee</span>
        </div>
      </div>
      {/* Right side: status/actions by ticket.status */}
      <div className="flex flex-col items-end flex-shrink-0 min-w-[180px] justify-center">
        <div className="flex items-center gap-3">
          {ticket.status === 'suggested' && (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <span className="relative cursor-pointer" {...popoverHandlers}>
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 4V2h6v2"/></svg>
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full px-1 text-xs border border-white">1</span>
                  <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full px-1 text-xs border border-white">?</span>
                </span>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-0 bg-transparent border-none shadow-none">
                <div className="bg-white rounded-xl shadow p-4 min-w-[260px] flex flex-col gap-2 border">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">WO#1</span>
                    <span className="text-xs text-gray-400">mm/dd</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 px-2 py-0.5">RN</Badge>
                    <span className="text-xs text-gray-700 bg-gray-100 rounded-full px-2 py-0.5">&lt;Route-name&gt; | &lt;seq&gt;</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-medium">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v16m0 0h16m-16 0l16-16" /></svg>
                      Dump & return
                    </span>
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Serviced
                    </span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          {ticket.status === 'unprocessed' && (
            <span className="relative">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 4V2h6v2"/></svg>
              <span className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-0.5 border border-white">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </span>
            </span>
          )}
          {ticket.status === 'matched' && (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <span className="relative cursor-pointer" {...popoverHandlers}>
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 4V2h6v2"/></svg>
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full px-1 text-xs border border-white">1</span>
                  <span className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border border-white">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                </span>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-0 bg-transparent border-none shadow-none">
                <div className="bg-white rounded-xl shadow p-4 min-w-[260px] flex flex-col gap-2 border">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">WO#1</span>
                    <span className="text-xs text-gray-400">mm/dd</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 px-2 py-0.5">RN</Badge>
                    <span className="text-xs text-gray-700 bg-gray-100 rounded-full px-2 py-0.5">&lt;Route-name&gt; | &lt;seq&gt;</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-medium">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v16m0 0h16m-16 0l16-16" /></svg>
                      Dump & return
                    </span>
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Serviced
                    </span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
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
          <Button variant="outline\" size="sm\" onClick={openWorkOrderPanel}>
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
                <Table>
                  <TableBody>
                    {mockTickets.filter(t => t.status === 'unprocessed').map(ticket => (
                      <TableRow key={ticket.id} className="align-middle">
                        <TableCell className="!p-0 align-middle" colSpan={7}>
                          <TicketRow ticket={ticket} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="suggested">
                <Table>
                  <TableBody>
                    {mockTickets.filter(t => t.status === 'suggested').map(ticket => (
                      <TableRow key={ticket.id} className="align-middle">
                        <TableCell className="!p-0 align-middle" colSpan={7}>
                          <TicketRow ticket={ticket} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="matched">
                <Table>
                  <TableBody>
                    {mockTickets.filter(t => t.status === 'matched').map(ticket => (
                      <TableRow key={ticket.id} className="align-middle">
                        <TableCell className="!p-0 align-middle" colSpan={7}>
                          <TicketRow ticket={ticket} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
