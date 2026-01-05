import { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';

const Stats = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    // Memanggil fungsi storage.get yang baru (versi Supabase)
    const statsData = await storage.get(STORAGE_KEYS.STATS);
    if (statsData) {
      setStats(statsData);
    }
  };

  return (
    <section className="py-12 px-6 lg:px-12">
      <div className="container mx-auto">
        <div className="bg-beige-light rounded-3xl shadow-lg p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.id || index}
                className="text-center animate-fadeIn"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <h3 className="text-5xl lg:text-6xl font-playfair font-bold text-beige-dark mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-700 font-inter font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;