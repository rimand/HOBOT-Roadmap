import { useState, useEffect, useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { timeline2024, timeline2025, productStats, TimelineItem } from '../lib/data';
import { Icons } from '../components/Icons';
import { verifySession, logout } from '../lib/auth';

interface HomeProps {
  isAuthenticated: boolean;
}

export default function Home({ isAuthenticated }: HomeProps) {
  const router = useRouter();
  const [activeYear, setActiveYear] = useState(2025);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Handle year change with animation
  const handleYearChange = (year: number) => {
    if (year !== activeYear) {
      setFadeKey(prev => prev + 1);
      setTimeout(() => setActiveYear(year), 200);
    }
  };

  // Get all unique products and types
  const allProducts = useMemo(() => {
    const products = new Set<string>();
    const currentTimeline = activeYear === 2024 ? timeline2024 : timeline2025;
    currentTimeline.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => {
          const productNames = ["Turntable", "Robotarm", "RobotArm", "LinearTrack", "treadmill", "ล้อ Combide", "Stage Mobile", "รางจอ", "จอแท่ง", "เครื่องดูดผ้า", "Display", "AGV", "EtherCAT", "Robot Sync"];
          productNames.forEach(p => {
            if (tag.includes(p)) products.add(p);
          });
        });
      }
    });
    return Array.from(products).sort();
  }, [activeYear]);

  const allTypes = ['success', 'tech', 'event', 'milestone', 'team'];

  // Filter timeline
  const filteredTimeline = useMemo(() => {
    const currentTimeline = activeYear === 2024 ? timeline2024 : timeline2025;
    return currentTimeline.filter(item => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          item.event.toLowerCase().includes(query) ||
          item.detail.toLowerCase().includes(query) ||
          (item.jobs && item.jobs.some(job => job.toLowerCase().includes(query))) ||
          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)));
        if (!matchesSearch) return false;
      }
      
      // Product filter
      if (selectedProducts.length > 0) {
        const hasProduct = item.tags && item.tags.some(tag => 
          selectedProducts.some(prod => tag.includes(prod))
        );
        if (!hasProduct) return false;
      }
      
      // Type filter
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(item.type)) return false;
      }
      
      return true;
    });
  }, [activeYear, searchQuery, selectedProducts, selectedTypes]);

  // Highlight search text
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <mark key={i} className="bg-yellow-200 px-1 rounded">{part}</mark> : part
    );
  };

  // Toggle expanded item
  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedProducts([]);
    setSelectedTypes([]);
  };

  const hasActiveFilters = searchQuery || selectedProducts.length > 0 || selectedTypes.length > 0;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearFilters();
        setShowFilters(false);
      }
      if (e.key === 'ArrowUp' && e.ctrlKey) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const currentTimeline = activeYear === 2024 ? timeline2024 : timeline2025;
  const workCount = activeYear === 2024 ? 5 : 17;

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Icons.Cpu />
            </div>
            <span className="font-bold text-xl tracking-tight">HOBOT ROADMAP</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-all no-print ${showFilters ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
              aria-label="Toggle filters"
            >
              <Icons.Filter />
            </button>
            <div className="flex bg-slate-100 p-1 rounded-full">
              {[2024, 2025].map(year => (
                <button 
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all ${activeYear === year ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className={`mb-6 space-y-4 no-print ${showFilters ? 'fade-in' : 'hidden'}`}>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหา events, jobs, หรือ tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all flex items-center gap-2"
                >
                  <Icons.X /> Clear Filters
                </button>
              )}
            </div>
            
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                    Search: &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery('')} className="hover:bg-blue-200 rounded-full p-0.5">
                      <Icons.X />
                    </button>
                  </span>
                )}
                {selectedProducts.map(prod => (
                  <span key={prod} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
                    {prod}
                    <button onClick={() => setSelectedProducts(prev => prev.filter(p => p !== prod))} className="hover:bg-purple-200 rounded-full p-0.5">
                      <Icons.X />
                    </button>
                  </span>
                ))}
                {selectedTypes.map(type => (
                  <span key={type} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-2">
                    {type}
                    <button onClick={() => setSelectedTypes(prev => prev.filter(t => t !== type))} className="hover:bg-indigo-200 rounded-full p-0.5">
                      <Icons.X />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="font-semibold mb-2 text-sm text-slate-700">Filter by Product</div>
              <div className="flex flex-wrap gap-2">
                {allProducts.map(prod => (
                  <button
                    key={prod}
                    onClick={() => {
                      setSelectedProducts(prev => 
                        prev.includes(prod) 
                          ? prev.filter(p => p !== prod)
                          : [...prev, prod]
                      );
                    }}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      selectedProducts.includes(prod)
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {prod}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="font-semibold mb-2 text-sm text-slate-700">Filter by Type</div>
              <div className="flex flex-wrap gap-2">
                {allTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedTypes(prev => 
                        prev.includes(type) 
                          ? prev.filter(t => t !== type)
                          : [...prev, type]
                      );
                    }}
                    className={`px-3 py-1 rounded-lg text-sm transition-all capitalize ${
                      selectedTypes.includes(type)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-12 fade-in">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Icons.Box /> HOBOT Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: "Robot Arm", icon: <Icons.Cpu />, color: "bg-indigo-500" },
              { name: "Linear Track", icon: <Icons.Settings />, color: "bg-cyan-500" },
              { name: "Turn Table", icon: <Icons.History />, color: "bg-blue-500" },
              { name: "Reveal Fabric", icon: <Icons.Zap />, color: "bg-purple-500" },
              { name: "Stage Mobile", icon: <Icons.Truck />, color: "bg-red-500" },
              { name: "Sliding rail", icon: <Icons.Box />, color: "bg-slate-500" },
              { name: "Treadmill", icon: <Icons.Target />, color: "bg-emerald-500" },
              { name: "Structure Accessory", icon: <Icons.Settings />, color: "bg-orange-500" },
            ].map((product, idx) => (
              <div 
                key={idx}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all hover:scale-105 text-center"
              >
                <div className={`w-12 h-12 ${product.color} rounded-lg flex items-center justify-center text-white mx-auto mb-3`}>
                  {product.icon}
                </div>
                <div className="text-sm font-semibold text-slate-800 leading-tight">
                  {product.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Icons.Calendar /> Timeline ปี {activeYear}
              <span className="text-sm font-normal text-slate-500">
                ({workCount} งาน)
              </span>
              {filteredTimeline.length !== currentTimeline.length && (
                <span className="text-sm font-normal text-slate-500">
                  (แสดง {filteredTimeline.length} จาก {currentTimeline.length})
                </span>
              )}
            </h2>
            
            {filteredTimeline.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
                <Icons.Alert />
                <p className="text-slate-500">ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-8 py-4">
                {filteredTimeline.map((item, index) => {
                  const isExpanded = expandedItems.has(index);
                  return (
                    <div key={index} className="relative fade-in slide-in">
                      <div className={`absolute -left-[41px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ring-4 ring-slate-50 transition-all ${
                        item.type === 'success' ? 'bg-emerald-500' : 
                        item.type === 'tech' ? 'bg-blue-500' : 
                        item.type === 'milestone' ? 'bg-purple-500' :
                        item.type === 'team' ? 'bg-orange-500' :
                        'bg-slate-400'
                      }`}></div>
                      <div 
                        className={`bg-white p-5 rounded-xl shadow-sm border transition-all cursor-pointer ${
                          item.type === 'success' ? 'border-emerald-200 hover:border-emerald-400' :
                          item.type === 'tech' ? 'border-blue-200 hover:border-blue-400' :
                          item.type === 'milestone' ? 'border-purple-200 hover:border-purple-400' :
                          'border-slate-200 hover:border-blue-300'
                        } ${isExpanded ? 'ring-2 ring-blue-200' : ''}`}
                        onClick={() => toggleExpanded(index)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{item.month}</span>
                              {item.event.startsWith('งาน ') ? (
                                <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-bold">งาน</span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-bold">เหตุการณ์</span>
                              )}
                            </div>
                            <h4 className="font-bold text-lg mb-1">{highlightText(item.event, searchQuery)}</h4>
                            <p className="text-slate-600 text-sm mb-3">{highlightText(item.detail, searchQuery)}</p>
                            {item.tags && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {item.tags.map((tag, tIdx) => (
                                  <span key={tIdx} className="text-[10px] px-2 py-1 bg-blue-50 text-blue-600 rounded font-bold uppercase">
                                    {highlightText(tag, searchQuery)}
                                  </span>
                                ))}
                              </div>
                            )}
                            {isExpanded && item.jobs && (
                              <div className="mt-3 pt-3 border-t border-slate-200 space-y-1">
                                <div className="text-xs font-semibold text-slate-500 mb-2">รายการงาน:</div>
                                {item.jobs.map((job, jIdx) => (
                                  <div key={jIdx} className="flex items-center gap-2 text-slate-700 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    {highlightText(job, searchQuery)}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {item.jobs && (
                            <button className="ml-2 text-slate-400 hover:text-slate-600 transition-all">
                              {isExpanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-8">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden fade-in">
              <div className="bg-slate-900 p-4 text-white font-bold">รายชื่อโปรเจกต์รายเดือน ({activeYear})</div>
              <div className="p-2 custom-scrollbar max-h-[500px] overflow-y-auto">
                {filteredTimeline.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-sm">ไม่พบข้อมูล</div>
                ) : (
                  <table className="w-full text-sm">
                    <tbody>
                      {filteredTimeline.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                          <td className="p-3 align-top font-bold text-blue-600 w-24">{item.month}</td>
                          <td className="p-3">
                            {item.jobs && item.jobs.map((job, jIdx) => (
                              <div key={jIdx} className="flex items-center gap-2 text-slate-700 mb-1 leading-tight">
                                <div className="w-1 h-1 rounded-full bg-slate-400"></div> 
                                {highlightText(job, searchQuery)}
                              </div>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {activeYear === 2025 && (
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 fade-in">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Icons.BarChart /> สรุปการใช้ Product (2025)
                </h2>
                <div className="space-y-4">
                  {productStats.map((prod, idx) => (
                    <div key={idx} className="group cursor-pointer">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-2 font-medium">{prod.name}</span>
                        <span className="font-bold">{prod.count} ครั้ง</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${prod.color} transition-all duration-500 group-hover:opacity-80`} 
                          style={{ width: `${(prod.count / 6) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      
      <ScrollToTop />
    </div>
  );
}

// Scroll to Top Component
function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (!visible) return null;
  
  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110 z-40 no-print"
      aria-label="Scroll to top"
    >
      <Icons.ArrowUp />
    </button>
  );
}

// Server-side authentication check
export const getServerSideProps: GetServerSideProps = async (context) => {
  const sessionToken = context.req.cookies.hobot_session;
  
  if (!sessionToken) {
    console.log('Index page: No session token, redirecting to /login');
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Verify session directly
  try {
    const { getSession } = await import('../lib/sessions');
    console.log('Index page: Checking session with token:', sessionToken.substring(0, 20) + '...');
    const session = getSession(sessionToken);
    
    if (session) {
      console.log('Index page: Session found, expiry:', new Date(session.expiry).toISOString());
      console.log('Index page: Current time:', new Date().toISOString());
      console.log('Index page: Is expired?', session.expiry < Date.now());
    }
    
    if (session && session.expiry > Date.now()) {
      console.log('Index page: Session valid, showing content');
      return {
        props: {
          isAuthenticated: true,
        },
      };
    } else {
      if (!session) {
        console.log('Index page: Session not found in memory');
      } else {
        console.log('Index page: Session expired');
      }
      console.log('Index page: Redirecting to /login');
    }
  } catch (error) {
    console.error('Index page: Session verification error:', error);
  }

  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
};

