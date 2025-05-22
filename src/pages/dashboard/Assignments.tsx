import { useState, useMemo } from 'react';
import { format, startOfToday, endOfToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterIcon, ChevronDown, Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft, ListIcon, MonitorIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
const Assignments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("all");
  const [timeFilter, setTimeFilter] = useState<string | undefined>('today');
  const [mockTestTab, setMockTestTab] = useState("completed");

  // Mock data for the calendar
  const currentMonth = 'March 2024';
  const currentDay = 7; // Thursday
  const calendarDays = [{
    day: "Mon",
    date: 4
  }, {
    day: "Tue",
    date: 5
  }, {
    day: "Wed",
    date: 6
  }, {
    day: "Thu",
    date: 7,
    active: true
  }, {
    day: "Fri",
    date: 8
  }, {
    day: "Sat",
    date: 9
  }, {
    day: "Sun",
    date: 10
  }];

  // Mock scheduled assignments
  const scheduledAssignments = [{
    time: "9:00",
    title: "Temperature Converter (Celsius to Fahrenheit & vice versa)",
    course: "Python",
    color: "bg-indigo-500"
  }, {
    time: "3:45",
    title: "Student Grade Management System",
    course: "Java",
    color: "bg-indigo-500"
  }];

  // Mock test data
  const mockTests = [{
    id: 1,
    title: "Graphic test",
    description: "Visual Performance Evaluation",
    date: "Wed, 20 Apr",
    time: "11AM - 11:45AM",
    progress: 60,
    status: "completed"
  }, {
    id: 2,
    title: "Graphic test",
    description: "Visual Performance Evaluation",
    date: "Wed, 20 Apr",
    time: "11AM - 11:45AM",
    progress: 0,
    status: "upcoming",
    countdownText: "Going live in 3h 56m 43s"
  }, {
    id: 3,
    title: "Graphic test",
    description: "Visual Performance Evaluation",
    date: "Wed, 20 Apr",
    time: "11AM - 11:45AM",
    status: "live"
  }];

  // Mock data for assignments
  const allAssignments = [{
    id: 1,
    type: "UI/UX Design",
    title: "Redesign doord app to increase customer interest",
    description: "Create a Wireframe for a Mobile App - Design a basic wireframe using Figma or Adobe XD",
    deadline: "Wed, 10 Mar",
    dueDate: "Wed, 05 Mar",
    status: "PENDING",
    date: new Date(2024, 2, 16) // March 16, 2024
  }, {
    id: 2,
    type: "Python",
    title: "Weather App (API Integration)",
    description: "Fetch real-time weather data using an API like OpenWeatherMap",
    deadline: "Wed, 10 Mar",
    dueDate: "Wed, 05 Mar",
    status: "DONE",
    date: new Date(2024, 2, 16) // March 16, 2024
  }, {
    id: 3,
    type: "Web development",
    title: "Blog Platform (CRUD Operations)",
    description: "Develop a simple blog where users can create, edit, and delete posts using Django/Flask or Node.js.",
    deadline: "Wed, 10 Mar",
    dueDate: "Wed, 05 Mar",
    status: "DONE",
    date: new Date(2024, 2, 18) // March 18, 2024
  }, {
    id: 4,
    type: "Java",
    title: "E-commerce Product Management",
    description: "Create a Java application to manage products with CRUD operations",
    deadline: "Wed, 10 Mar",
    dueDate: "Wed, 05 Mar",
    status: "PENDING",
    date: new Date(2024, 2, 20) // March 20, 2024
  }];

  // Filter assignments based on selected date, tab, and time filter
  const filteredAssignments = useMemo(() => {
    let filtered = allAssignments;

    // If there's a time filter, apply it
    if (timeFilter) {
      const today = new Date();
      if (timeFilter === 'today') {
        filtered = filtered.filter(assignment => isWithinInterval(assignment.date, {
          start: startOfToday(),
          end: endOfToday()
        }));
      } else if (timeFilter === 'this-week') {
        filtered = filtered.filter(assignment => isWithinInterval(assignment.date, {
          start: startOfWeek(today, {
            weekStartsOn: 1
          }),
          end: endOfWeek(today, {
            weekStartsOn: 1
          })
        }));
      } else if (timeFilter === 'this-month') {
        filtered = filtered.filter(assignment => isWithinInterval(assignment.date, {
          start: startOfMonth(today),
          end: endOfMonth(today)
        }));
      }
    }
    // If no time filter but date is selected, filter by exact date
    else if (date) {
      filtered = filtered.filter(assignment => format(assignment.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
    }

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(assignment => {
        if (activeTab === "ongoing") return assignment.status === "PENDING";
        if (activeTab === "done") return assignment.status === "DONE";
        return true;
      });
    }
    return filtered;
  }, [date, activeTab, timeFilter, allAssignments]);

  // Extract all dates that have assignments for highlighting in the calendar
  const assignmentDates = useMemo(() => {
    return allAssignments.map(assignment => assignment.date);
  }, [allAssignments]);
  const handleFilterChange = (filter: string) => {
    setTimeFilter(filter);
  };
  const getFilterLabel = () => {
    if (timeFilter === 'today') return 'Today';
    if (timeFilter === 'this-week') return 'This Week';
    if (timeFilter === 'this-month') return 'This Month';
    return 'All Time';
  };

  // Filter mock tests based on selected tab
  const filteredMockTests = useMemo(() => {
    return mockTests.filter(test => {
      if (mockTestTab === "completed") return test.status === "completed";
      if (mockTestTab === "active") return test.status === "live";
      if (mockTestTab === "upcoming") return test.status === "upcoming";
      return true;
    });
  }, [mockTestTab, mockTests]);
  return <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Assignments</h1>
            <p className="text-muted-foreground">Track and manage your learning assignments</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                {getFilterLabel()}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuRadioGroup value={timeFilter || "all-time"} onValueChange={value => handleFilterChange(value === "all-time" ? undefined : value)}>
                <DropdownMenuRadioItem value="all-time">All Time</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="today">Today</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="this-week">This Week</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="this-month">This Month</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 ">
          {/* Left Column - Calendar & Scheduled Assignments */}
          

          {/* Right Column - Assignments List */}
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardContent className="p-0">
                <Tabs defaultValue="all" className="w-full" onValueChange={value => setActiveTab(value)}>
                  <TabsList className="w-full grid grid-cols-3 px-6 pt-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="ongoing">Pending</TabsTrigger>
                    <TabsTrigger value="done">Done</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="px-6 py-4">
                    <div className="space-y-4">
                      {filteredAssignments.length > 0 ? filteredAssignments.map(assignment => <div key={assignment.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-3">
                                <div className="min-w-10">
                                  <Badge className="bg-white text-black border border-gray-200 font-normal">
                                    {assignment.type}
                                  </Badge>
                                </div>
                                <div>
                                  <h3 className="font-semibold text-base mb-1">{assignment.title}</h3>
                                  <p className="text-sm text-muted-foreground">{assignment.description}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end min-w-32">
                                <div className="flex items-center mb-2">
                                  <CalendarIcon className="w-4 h-4 mr-1" />
                                  <span className="text-sm">{assignment.dueDate}</span>
                                </div>
                                <Badge className={`${assignment.status === 'DONE' ? 'bg-green-100 text-green-800 border-none' : 'bg-yellow-100 text-yellow-800 border-none'}`}>
                                  {assignment.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                              <div>
                                <p className="text-xs text-muted-foreground">Deadline</p>
                                <p className="font-medium text-sm">{assignment.deadline}</p>
                              </div>
                              {assignment.status === "PENDING" && <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-1 h-auto rounded-full text-sm">
                                  check
                                </Button>}
                            </div>
                          </div>) : <div className="text-center py-8 text-muted-foreground">
                          No assignments found for the selected filter
                        </div>}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ongoing" className="px-6 py-4">
                    <div className="space-y-4">
                      {filteredAssignments.length > 0 ? filteredAssignments.map(assignment => <div key={assignment.id} className="border rounded-lg p-4">
                            {/* Same structure as "all" tab but only showing ongoing assignments */}
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-3">
                                <div className="min-w-10">
                                  <Badge className="bg-white text-black border border-gray-200 font-normal">
                                    {assignment.type}
                                  </Badge>
                                </div>
                                <div>
                                  <h3 className="font-semibold text-base mb-1">{assignment.title}</h3>
                                  <p className="text-sm text-muted-foreground">{assignment.description}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end min-w-32">
                                <div className="flex items-center mb-2">
                                  <CalendarIcon className="w-4 h-4 mr-1" />
                                  <span className="text-sm">{assignment.dueDate}</span>
                                </div>
                                <Badge className="bg-yellow-100 text-yellow-800 border-none">
                                  {assignment.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                              <div>
                                <p className="text-xs text-muted-foreground">Deadline</p>
                                <p className="font-medium text-sm">{assignment.deadline}</p>
                              </div>
                              <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-1 h-auto rounded-full text-sm">
                                check
                              </Button>
                            </div>
                          </div>) : <div className="text-center py-8 text-muted-foreground">
                          No pending assignments found
                        </div>}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="done" className="px-6 py-4">
                    <div className="space-y-4">
                      {filteredAssignments.length > 0 ? filteredAssignments.map(assignment => <div key={assignment.id} className="border rounded-lg p-4">
                            {/* Same structure as other tabs but only showing completed assignments */}
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-3">
                                <div className="min-w-10">
                                  <Badge className="bg-white text-black border border-gray-200 font-normal">
                                    {assignment.type}
                                  </Badge>
                                </div>
                                <div>
                                  <h3 className="font-semibold text-base mb-1">{assignment.title}</h3>
                                  <p className="text-sm text-muted-foreground">{assignment.description}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end min-w-32">
                                <div className="flex items-center mb-2">
                                  <CalendarIcon className="w-4 h-4 mr-1" />
                                  <span className="text-sm">{assignment.dueDate}</span>
                                </div>
                                <Badge className="bg-green-100 text-green-800 border-none">
                                  {assignment.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                              <div>
                                <p className="text-xs text-muted-foreground">Deadline</p>
                                <p className="font-medium text-sm">{assignment.deadline}</p>
                              </div>
                            </div>
                          </div>) : <div className="text-center py-8 text-muted-foreground">
                          No completed assignments found
                        </div>}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>;
};
export default Assignments;