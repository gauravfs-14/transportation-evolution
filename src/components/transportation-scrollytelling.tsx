"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Car, Bus, Train, Bike, Plane } from "lucide-react";
import CityMap from "./city-map";

// Transportation data
const transportationModes = [
  { name: "Car", value: 45, color: "#FF6B6B", icon: Car },
  { name: "Public Transit", value: 28, color: "#4ECDC4", icon: Bus },
  { name: "Train", value: 15, color: "#FFD166", icon: Train },
  { name: "Bicycle", value: 8, color: "#06D6A0", icon: Bike },
  { name: "Air Travel", value: 4, color: "#118AB2", icon: Plane },
];

const yearlyData = [
  { year: 2010, car: 55, publicTransit: 20, train: 12, bicycle: 5, air: 8 },
  { year: 2012, car: 52, publicTransit: 22, train: 13, bicycle: 6, air: 7 },
  { year: 2014, car: 50, publicTransit: 24, train: 14, bicycle: 6, air: 6 },
  { year: 2016, car: 48, publicTransit: 25, train: 15, bicycle: 7, air: 5 },
  { year: 2018, car: 46, publicTransit: 27, train: 15, bicycle: 8, air: 4 },
  { year: 2020, car: 45, publicTransit: 28, train: 15, bicycle: 8, air: 4 },
];

const emissionsData = [
  { year: 2010, car: 100, publicTransit: 40, train: 30, bicycle: 0, air: 120 },
  { year: 2012, car: 95, publicTransit: 38, train: 28, bicycle: 0, air: 115 },
  { year: 2014, car: 90, publicTransit: 35, train: 25, bicycle: 0, air: 110 },
  { year: 2016, car: 85, publicTransit: 32, train: 22, bicycle: 0, air: 105 },
  { year: 2018, car: 80, publicTransit: 30, train: 20, bicycle: 0, air: 100 },
  { year: 2020, car: 75, publicTransit: 28, train: 18, bicycle: 0, air: 95 },
];

const commuteTimes = [
  { mode: "Car", time: 28, color: "#FF6B6B" },
  { mode: "Bus", time: 42, color: "#4ECDC4" },
  { mode: "Train", time: 35, color: "#FFD166" },
  { mode: "Bicycle", time: 22, color: "#06D6A0" },
  { mode: "Walking", time: 45, color: "#118AB2" },
];

const futureProjections = [
  { year: 2020, car: 45, publicTransit: 28, train: 15, bicycle: 8, air: 4 },
  { year: 2025, car: 40, publicTransit: 30, train: 18, bicycle: 10, air: 2 },
  { year: 2030, car: 35, publicTransit: 32, train: 20, bicycle: 12, air: 1 },
  { year: 2035, car: 30, publicTransit: 35, train: 22, bicycle: 13, air: 0 },
  { year: 2040, car: 25, publicTransit: 38, train: 24, bicycle: 13, air: 0 },
];

// Custom hook for scroll-triggered animations
function useScrollSection(threshold = 0.5) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    const scrollListener = () => {
      if (!ref.current) return;

      const element = ref.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how far the element is through the viewport
      const visiblePortion = Math.max(
        0,
        Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top)
      );
      const visibleRatio = visiblePortion / element.offsetHeight;

      setProgress(Math.min(1, Math.max(0, visibleRatio)));
    };

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
      window.addEventListener("scroll", scrollListener);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
        window.removeEventListener("scroll", scrollListener);
      }
    };
  }, [threshold]);

  return { ref, isVisible, progress };
}

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const chartReveal = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function TransportationScrollytelling() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const intro = useScrollSection(0.3);
  const modeSplit = useScrollSection(0.3);
  const trends = useScrollSection(0.3);
  const emissions = useScrollSection(0.3);
  const commute = useScrollSection(0.3);
  const future = useScrollSection(0.3);
  const conclusion = useScrollSection(0.3);

  // Animation for the progress bar
  const scaleX = useTransform(smoothProgress, [0, 1], [0, 100]);

  // For the trends chart, we'll reveal data series one by one
  const [visibleSeries, setVisibleSeries] = useState({
    car: false,
    publicTransit: false,
    train: false,
    bicycle: false,
    air: false,
  });

  useEffect(() => {
    if (trends.progress > 0.3)
      setVisibleSeries((prev) => ({ ...prev, car: true }));
    if (trends.progress > 0.4)
      setVisibleSeries((prev) => ({ ...prev, publicTransit: true }));
    if (trends.progress > 0.5)
      setVisibleSeries((prev) => ({ ...prev, train: true }));
    if (trends.progress > 0.6)
      setVisibleSeries((prev) => ({ ...prev, bicycle: true }));
    if (trends.progress > 0.7)
      setVisibleSeries((prev) => ({ ...prev, air: true }));
  }, [trends.progress]);

  // For the emissions chart
  const [visibleEmissions, setVisibleEmissions] = useState({
    car: false,
    publicTransit: false,
    train: false,
    bicycle: false,
    air: false,
  });

  useEffect(() => {
    if (emissions.progress > 0.3)
      setVisibleEmissions((prev) => ({ ...prev, car: true }));
    if (emissions.progress > 0.4)
      setVisibleEmissions((prev) => ({ ...prev, publicTransit: true }));
    if (emissions.progress > 0.5)
      setVisibleEmissions((prev) => ({ ...prev, train: true }));
    if (emissions.progress > 0.6)
      setVisibleEmissions((prev) => ({ ...prev, bicycle: true }));
    if (emissions.progress > 0.7)
      setVisibleEmissions((prev) => ({ ...prev, air: true }));
  }, [emissions.progress]);

  // For the future projections
  const [showFuture, setShowFuture] = useState(false);

  useEffect(() => {
    if (future.progress > 0.5) setShowFuture(true);
  }, [future.progress]);

  return (
    <div className="relative">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-primary"
          style={{ width: scaleX.get() + "%" }}
        />
      </div>

      {/* Introduction */}
      <section
        ref={intro.ref}
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      >
        <motion.div
          initial="hidden"
          animate={intro.isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            The Evolution of Transportation
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-12">
            Scroll to explore how we move around our cities and the impact of
            our transportation choices
          </p>

          <motion.div
            className="flex justify-center space-x-8 mt-12"
            variants={staggerChildren}
          >
            {transportationModes.map((mode) => (
              <motion.div
                key={mode.name}
                variants={fadeIn}
                className="flex flex-col items-center"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: mode.color + "20" }}
                >
                  <mode.icon size={32} style={{ color: mode.color }} />
                </div>
                <span className="text-sm font-medium">{mode.name}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-24 text-gray-500 animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <p>Scroll to begin</p>
            <svg
              className="w-6 h-6 mx-auto mt-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Transportation Mode Split */}
      <section
        ref={modeSplit.ref}
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-white"
      >
        <motion.div
          initial="hidden"
          animate={modeSplit.isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          className="max-w-5xl w-full mx-auto"
        >
          <h2 className="text-4xl font-bold mb-8 text-center">
            How We Get Around Today
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Despite growing alternatives, personal vehicles still dominate our
            transportation landscape, accounting for nearly half of all trips in
            urban areas.
          </p>

          <motion.div className="w-full h-[500px]" variants={chartReveal}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={transportationModes}
                margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  label={{
                    value: "Percentage (%)",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={(props) => {
                    const { x, y, payload } = props;
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={-10}
                          y={4}
                          textAnchor="end"
                          fill="#666"
                          fontSize={12}
                        >
                          {payload.value}
                        </text>
                      </g>
                    );
                  }}
                />
                <Tooltip formatter={(value) => [`${value}%`, "Usage"]} />
                <Bar
                  dataKey="value"
                  name="Transportation Usage"
                  animationDuration={1000}
                  animationBegin={300}
                >
                  {transportationModes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerChildren}
          >
            <motion.div
              variants={fadeIn}
              className="bg-gray-50 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Urban vs. Rural
              </h3>
              <p className="text-gray-600">
                Transportation choices vary significantly between urban and
                rural areas, with public transit usage 5x higher in dense urban
                environments.
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="bg-gray-50 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Age Demographics
              </h3>
              <p className="text-gray-600">
                Younger generations are increasingly choosing alternative
                transportation modes, with car ownership declining among those
                under 30.
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="bg-gray-50 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Economic Factors
              </h3>
              <p className="text-gray-600">
                Transportation costs account for the second-largest household
                expense after housing, averaging 16% of household budgets.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Transportation Trends */}
      <section
        ref={trends.ref}
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50"
      >
        <motion.div
          initial="hidden"
          animate={trends.isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          className="max-w-5xl w-full mx-auto"
        >
          <h2 className="text-4xl font-bold mb-8 text-center">
            Transportation Trends (2010-2020)
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Over the past decade, we&apos;ve seen a gradual shift away from car
            dependency toward more diverse transportation options.
          </p>

          <motion.div className="w-full h-[500px]" variants={chartReveal}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={yearlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis
                  label={{
                    value: "Percentage (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                {visibleSeries.car && (
                  <Area
                    type="monotone"
                    dataKey="car"
                    stackId="1"
                    stroke="#FF6B6B"
                    fill="#FF6B6B"
                    name="Car"
                    animationDuration={1000}
                  />
                )}
                {visibleSeries.publicTransit && (
                  <Area
                    type="monotone"
                    dataKey="publicTransit"
                    stackId="1"
                    stroke="#4ECDC4"
                    fill="#4ECDC4"
                    name="Public Transit"
                    animationDuration={1000}
                  />
                )}
                {visibleSeries.train && (
                  <Area
                    type="monotone"
                    dataKey="train"
                    stackId="1"
                    stroke="#FFD166"
                    fill="#FFD166"
                    name="Train"
                    animationDuration={1000}
                  />
                )}
                {visibleSeries.bicycle && (
                  <Area
                    type="monotone"
                    dataKey="bicycle"
                    stackId="1"
                    stroke="#06D6A0"
                    fill="#06D6A0"
                    name="Bicycle"
                    animationDuration={1000}
                  />
                )}
                {visibleSeries.air && (
                  <Area
                    type="monotone"
                    dataKey="air"
                    stackId="1"
                    stroke="#118AB2"
                    fill="#118AB2"
                    name="Air Travel"
                    animationDuration={1000}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="mt-12 bg-white p-6 rounded-lg shadow-sm"
            variants={fadeIn}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Key Insights
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  Car usage has declined by 10 percentage points over the decade
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  Public transit and bicycle usage have seen the most
                  significant growth
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  Air travel for commuting has decreased as remote work options
                  expanded
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  The diversification of transportation modes indicates changing
                  urban planning priorities
                </span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* Environmental Impact */}
      <section
        ref={emissions.ref}
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-white"
      >
        <motion.div
          initial="hidden"
          animate={emissions.isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          className="max-w-5xl w-full mx-auto"
        >
          <h2 className="text-4xl font-bold mb-8 text-center">
            Environmental Impact
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Transportation is responsible for nearly 30% of greenhouse gas
            emissions in developed countries, with significant variations
            between different modes.
          </p>

          <motion.div className="w-full h-[500px]" variants={chartReveal}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={emissionsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis
                  label={{
                    value: "CO₂ Emissions (Index)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                {visibleEmissions.car && (
                  <Bar
                    dataKey="car"
                    name="Car"
                    fill="#FF6B6B"
                    animationDuration={1000}
                  />
                )}
                {visibleEmissions.publicTransit && (
                  <Bar
                    dataKey="publicTransit"
                    name="Public Transit"
                    fill="#4ECDC4"
                    animationDuration={1000}
                  />
                )}
                {visibleEmissions.train && (
                  <Bar
                    dataKey="train"
                    name="Train"
                    fill="#FFD166"
                    animationDuration={1000}
                  />
                )}
                {visibleEmissions.bicycle && (
                  <Bar
                    dataKey="bicycle"
                    name="Bicycle"
                    fill="#06D6A0"
                    animationDuration={1000}
                  />
                )}
                {visibleEmissions.air && (
                  <Bar
                    dataKey="air"
                    name="Air Travel"
                    fill="#118AB2"
                    animationDuration={1000}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={staggerChildren}
          >
            <motion.div
              variants={fadeIn}
              className="bg-gray-50 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Emissions Reduction
              </h3>
              <p className="text-gray-600">
                Shifting just 10% of car trips to public transit or active
                transportation could reduce transportation emissions by up to
                15% in urban areas.
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="bg-gray-50 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Electric Revolution
              </h3>
              <p className="text-gray-600">
                Electric vehicles are projected to make up 30% of new car sales
                by 2030, potentially reducing emissions from personal vehicles
                by up to 50%.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Commute Times */}
      <section
        ref={commute.ref}
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50"
      >
        <motion.div
          initial="hidden"
          animate={commute.isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          className="max-w-5xl w-full mx-auto"
        >
          <h2 className="text-4xl font-bold mb-8 text-center">
            The Daily Commute
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            The average commuter spends over 200 hours per year traveling to and
            from work, with significant variations based on transportation mode
            and urban design.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div className="w-full h-[400px]" variants={chartReveal}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={commuteTimes}
                  margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    label={{
                      value: "Average Time (minutes)",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis dataKey="mode" type="category" />
                  <Tooltip />
                  <Bar
                    dataKey="time"
                    name="Average Commute Time (minutes)"
                    animationDuration={1000}
                    animationBegin={300}
                  >
                    {commuteTimes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div variants={staggerChildren} className="space-y-6">
              <motion.div
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Time Cost
                </h3>
                <p className="text-gray-600">
                  The average American spends 52 minutes commuting each day,
                  equivalent to 9 full days per year.
                </p>
              </motion.div>
              <motion.div
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Multimodal Benefits
                </h3>
                <p className="text-gray-600">
                  Cities with integrated transportation systems see 15-20%
                  shorter average commute times.
                </p>
              </motion.div>
              <motion.div
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Quality of Life
                </h3>
                <p className="text-gray-600">
                  Studies show that every 10 minutes added to a commute
                  decreases job satisfaction by 17%.
                </p>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 w-full h-[300px] bg-white rounded-lg shadow-sm overflow-hidden"
            variants={fadeIn}
            style={{ opacity: commute.progress > 0.7 ? 1 : 0 }}
          >
            <CityMap progress={commute.progress} />
          </motion.div>
        </motion.div>
      </section>

      {/* Future of Transportation */}
      <section
        ref={future.ref}
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-white"
      >
        <motion.div
          initial="hidden"
          animate={future.isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          className="max-w-5xl w-full mx-auto"
        >
          <h2 className="text-4xl font-bold mb-8 text-center">
            The Future of Transportation
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Emerging technologies and changing urban designs are reshaping how
            we&apos;ll move in the coming decades.
          </p>

          <motion.div className="w-full h-[500px]" variants={chartReveal}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={showFuture ? futureProjections : yearlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis
                  label={{
                    value: "Percentage (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="car"
                  stroke="#FF6B6B"
                  name="Car"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="publicTransit"
                  stroke="#4ECDC4"
                  name="Public Transit"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="train"
                  stroke="#FFD166"
                  name="Train"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="bicycle"
                  stroke="#06D6A0"
                  name="Bicycle"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="air"
                  stroke="#118AB2"
                  name="Air Travel"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerChildren}
          >
            <motion.div
              variants={fadeIn}
              className="bg-gray-50 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Autonomous Vehicles
              </h3>
              <p className="text-gray-600">
                Self-driving technology could reduce car ownership by up to 80%
                in urban areas through shared autonomous fleets.
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="bg-gray-50 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Micromobility
              </h3>
              <p className="text-gray-600">
                Electric scooters, bikes, and other small vehicles are projected
                to handle 25% of trips under 5 miles by 2030.
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="bg-gray-50 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                15-Minute Cities
              </h3>
              <p className="text-gray-600">
                Urban planning is shifting toward designs where all essential
                services are within a 15-minute walk or bike ride.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Conclusion */}
      <section
        ref={conclusion.ref}
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-white"
      >
        <motion.div
          initial="hidden"
          animate={conclusion.isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-8">
            Transportation Transformation
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Our transportation choices shape our cities, our environment, and
            our daily lives. The data shows we&apos;re in the midst of a
            significant transition toward more sustainable, efficient, and
            diverse mobility options.
          </p>

          <motion.div
            className="flex flex-wrap justify-center gap-6 mb-12"
            variants={staggerChildren}
          >
            <motion.div
              variants={fadeIn}
              className="bg-white p-6 rounded-lg shadow-sm max-w-xs"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Car className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Declining Car Dependence
              </h3>
              <p className="text-gray-600">
                Personal vehicle usage is projected to fall below 30% of urban
                trips by 2040.
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="bg-white p-6 rounded-lg shadow-sm max-w-xs"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Train className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Transit Renaissance
              </h3>
              <p className="text-gray-600">
                Cities investing in public transit see 3x economic returns
                through reduced congestion and improved access.
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="bg-white p-6 rounded-lg shadow-sm max-w-xs"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Bike className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Active Transportation
              </h3>
              <p className="text-gray-600">
                Every dollar invested in walking and cycling infrastructure
                saves $5 in healthcare costs.
              </p>
            </motion.div>
          </motion.div>

          <motion.p
            className="text-2xl font-medium text-gray-800 mt-12"
            variants={fadeIn}
          >
            The future of transportation is multimodal, sustainable, and
            human-centered.
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
}
