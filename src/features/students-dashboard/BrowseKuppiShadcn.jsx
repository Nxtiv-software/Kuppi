import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAvailableSessions, joinSession, showInterestInSession } from '../../services/api';
import { toast } from 'react-hot-toast';
import { Search, Calendar, Users, Star, Clock, BookOpen, Filter, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Skeleton } from '../../components/ui/skeleton';
import img from "../../assets/images/img.png";

const BrowseKuppisShadcn = () => {
  const [filters, setFilters] = useState({
    subject: 'all',
    level: 'all',
    priceRange: 'all',
    date: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [joinLoading, setJoinLoading] = useState({});
  const queryClient = useQueryClient();

  // Build API filters
  const apiFilters = {
    subject: filters.subject !== 'all' ? filters.subject : undefined,
    level: filters.level !== 'all' ? filters.level : undefined,
    page: 1,
    limit: 20
  };

  // Fetch available sessions
  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['availableSessions', apiFilters],
    queryFn: () => getAvailableSessions(apiFilters)
  });

  // Filter sessions based on search term and client-side filters
  const filteredSessions = sessions?.data?.sessions?.filter(session => {
    const matchesSearch = searchTerm === '' || 
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice = filters.priceRange === 'all' || 
      (filters.priceRange === '0-200' && session.price <= 200) ||
      (filters.priceRange === '200-500' && session.price > 200 && session.price <= 500) ||
      (filters.priceRange === '500-1000' && session.price > 500 && session.price <= 1000) ||
      (filters.priceRange === '1000+' && session.price > 1000);

    return matchesSearch && matchesPrice;
  }) || [];

  const handleJoinSession = async (sessionId) => {
    try {
      setJoinLoading(prev => ({ ...prev, [sessionId]: true }));
      await joinSession(sessionId);
      toast.success('Successfully joined the session!');
      queryClient.invalidateQueries(['availableSessions']);
      queryClient.invalidateQueries(['myScheduledSessions']);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setJoinLoading(prev => ({ ...prev, [sessionId]: false }));
    }
  };

  const handleShowInterest = async (sessionId) => {
    try {
      setJoinLoading(prev => ({ ...prev, [sessionId]: true }));
      await showInterestInSession(sessionId);
      toast.success('Interest shown successfully! Tutor will be notified.');
      queryClient.invalidateQueries(['availableSessions']);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setJoinLoading(prev => ({ ...prev, [sessionId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for subjects, topics, or instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select value={filters.subject} onValueChange={(value) => setFilters({...filters, subject: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="combined-mathematics">Combined Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Level</label>
                <Select value={filters.level} onValueChange={(value) => setFilters({...filters, level: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <Select value={filters.priceRange} onValueChange={(value) => setFilters({...filters, priceRange: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Price</SelectItem>
                    <SelectItem value="0-200">Rs. 0 - 200</SelectItem>
                    <SelectItem value="200-500">Rs. 200 - 500</SelectItem>
                    <SelectItem value="500-1000">Rs. 500 - 1000</SelectItem>
                    <SelectItem value="1000+">Rs. 1000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Select value={filters.date} onValueChange={(value) => setFilters({...filters, date: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Date</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          Available Sessions ({filteredSessions.length})
        </h3>
        <Select defaultValue="date">
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="popularity">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to load sessions</h3>
            <p className="text-muted-foreground text-center">{error.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredSessions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No sessions found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your filters or search terms to find more sessions.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Sessions Grid */}
      {!isLoading && !error && filteredSessions.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer border-2 hover:border-primary/50">
              <div className="relative h-48 overflow-hidden">
                <img src={img} alt={session.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-background/95 backdrop-blur-sm shadow-lg">
                    {session.level}
                  </Badge>
                </div>
                {session.isEnrolled && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-600 shadow-lg">Enrolled</Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{session.title}</CardTitle>
                  <div className="flex items-center gap-1 shrink-0 bg-yellow-50 dark:bg-yellow-950 px-2 py-1 rounded-md">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">{session.rating.toFixed(1)}</span>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  by <span className="font-medium">{session.instructor}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Badge variant="outline" className="font-medium">
                  {session.subject.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{session.description}</p>

                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <span>
                      {session.date 
                        ? new Date(session.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                        : 'Date TBD'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <span>
                      {session.time ? `${session.time} (${session.duration}h)` : 'Time TBD'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <span>
                      {session.source === 'tutor_created' && session.status !== 'scheduled'
                        ? `${session.interestedStudents?.length || 0} interested`
                        : `${session.enrolled}/${session.maxStudents} enrolled`}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t pt-4 bg-muted/30">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-primary">Rs. {session.price}</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {session.source === 'tutor_created' && session.status !== 'scheduled'
                      ? `${session.interestedStudents?.length || 0} needed`
                      : `${session.availableSpots} spots left`}
                  </p>
                </div>

                {session.source === 'tutor_created' ? (
                  session.status === 'scheduled' ? (
                    <Button 
                      onClick={() => !session.isEnrolled && handleJoinSession(session.id)}
                      disabled={session.isEnrolled || joinLoading[session.id] || session.availableSpots === 0}
                      variant={session.isEnrolled ? "secondary" : "default"}
                      size="lg"
                      className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {joinLoading[session.id] ? 'Loading...' : 
                       session.isEnrolled ? 'Enrolled ✓' : 
                       session.availableSpots === 0 ? 'Full' : 'Enroll Now'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => !session.hasShownInterest && handleShowInterest(session.id)}
                      disabled={session.hasShownInterest || joinLoading[session.id]}
                      variant={session.hasShownInterest ? "secondary" : "default"}
                      size="lg"
                      className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {joinLoading[session.id] ? 'Loading...' : 
                       session.hasShownInterest ? 'Interest Shown ✓' : 'Show Interest'}
                    </Button>
                  )
                ) : (
                  <Button 
                    onClick={() => !session.isEnrolled && handleJoinSession(session.id)}
                    disabled={session.isEnrolled || joinLoading[session.id] || session.availableSpots === 0}
                    variant={session.isEnrolled ? "secondary" : "default"}
                    size="lg"
                    className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {joinLoading[session.id] ? 'Loading...' : 
                     session.isEnrolled ? 'Enrolled ✓' : 
                     session.availableSpots === 0 ? 'Full' : 'Join Now'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseKuppisShadcn;
