"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Calendar, Clock, DollarSign, MessageSquare, Truck, Users } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function DashboardOverview() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your Hauler Hero dashboard.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Apr 23, 2025
          </Button>
          <Button size="sm">
            <Truck className="mr-2 h-4 w-4" />
            Add Route
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+12 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$24,685</div>
                <p className="text-xs text-muted-foreground">+8.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">+1.1% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Today's Routes</CardTitle>
                <CardDescription>You have 8 routes scheduled for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "North Springfield", driver: "John Smith", stops: 42, progress: 65, status: "In Progress" },
                    {
                      name: "Downtown Commercial",
                      driver: "Maria Garcia",
                      stops: 28,
                      progress: 100,
                      status: "Completed",
                    },
                    {
                      name: "Westside Residential",
                      driver: "David Johnson",
                      stops: 36,
                      progress: 75,
                      status: "In Progress",
                    },
                    { name: "East County", driver: "Sarah Williams", stops: 31, progress: 0, status: "Not Started" },
                  ].map((route, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-full space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{route.name}</span>
                            <Badge
                              variant={
                                route.status === "Completed"
                                  ? "light-green"
                                  : route.status === "In Progress"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {route.status}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">{route.stops} stops</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={route.progress} className="h-2" />
                          <span className="text-sm text-muted-foreground">{route.progress}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Driver: {route.driver}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { icon: <Truck className="h-4 w-4" />, title: "Route #124 completed", time: "2 hours ago" },
                    { icon: <Users className="h-4 w-4" />, title: "New customer added", time: "4 hours ago" },
                    { icon: <MessageSquare className="h-4 w-4" />, title: "Customer message sent", time: "Yesterday" },
                    { icon: <DollarSign className="h-4 w-4" />, title: "Invoice #3842 paid", time: "Yesterday" },
                    { icon: <Clock className="h-4 w-4" />, title: "Route #122 delayed", time: "2 days ago" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/dashboard/bulk-messaging">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Messages
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Add Customer
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Truck className="mr-2 h-4 w-4" />
                    Schedule Route
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Create Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Overdue Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-xs text-muted-foreground mb-4">From 28 overdue invoices</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/billing">
                    View All Invoices
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Renewals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground mb-4">Contracts renewing in the next 30 days</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Renewals
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View detailed analytics for your business</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Analytics dashboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view business reports</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Reports dashboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>View and manage your notifications</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Notifications dashboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
