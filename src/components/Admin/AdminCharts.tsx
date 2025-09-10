import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  BarChart,
  Bar,
  LabelList,
} from "recharts";
import { useTranslation } from "react-i18next";
import { useDashboardStatsCharts } from "../../hooks/useDashboardStatsCharts";

// // Sample chart data
// const lineChartData = [
//   { name: "21", users: 400 },
//   { name: "22", users: 600 },
//   { name: "23", users: 800 },
//   { name: "24", users: 500 },
//   { name: "25", users: 950 }
// ];

// const barChartData = [
//   { name: "21", certificates: 50 },
//   { name: "22", certificates: 80 },
//   { name: "23", certificates: 65 },
//   { name: "24", certificates: 90 },
//   { name: "25", certificates: 75 },
// ];

const AdminCharts = () => {
  const { t, i18n } = useTranslation();
  const currLanguage = i18n.language;
  const today = new Date().toISOString().slice(0, 10); // e.g. "2025-07-24"
  const { data, loading, error } = useDashboardStatsCharts(today);

  if (loading) return <div>{t("Loading chart data...")}</div>;
  if (error)
    return <div className=" text-red-700">{t("Error loading Chart data")}</div>;

  const lineChartData = data.map((item) => {
    const d = new Date(item.date);

    const month = d.toLocaleDateString(currLanguage === "en" ? "en" : "fr", {
      month: "short",
    });

    const day = d.getDate();

    return {
      name: `${month} ${day}`,
      users: item.dailySignups,
    };
  });

  const barChartData = data.map((item) => {
    const d = new Date(item.date);
    const month = d.toLocaleDateString(currLanguage === "en" ? "en" : "fr", {
      month: "short",
    });
    const day = d.getDate();
    return {
      name: `${month} ${day}`,
      certificates: item.dailyCertificatesIssued,
    };
  });

  return (
    <>
      {/* Charts */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 2xl:gap-20 pt-4 w-full">
        <div
          className="flex flex-col gap-5 2xl:gap-8 flex-1"
          data-testid="chart"
        >
          <h5 className="text-lg 2xl:text-2xl capitalize leading-[20px] 2xl:leading-1.5 font-bold text-[#1B1B1B] text-center lg:text-left">
            {t("New Users per Day")}
          </h5>
          <div className="bg-white py-4 px-2 h-80 sm:h-96 2xl:h-[400px] w-full border border-[#DDDDDD]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  stroke="#DBEAFE"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  tick={{
                    fill: "#94A3B8",
                    fontSize:
                      window.innerWidth < 640
                        ? 14
                        : window.innerWidth < 1600
                        ? 16
                        : 20,
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tick={{
                    fill: "#94A3B8",
                    fontSize:
                      window.innerWidth < 640
                        ? 14
                        : window.innerWidth < 1600
                        ? 16
                        : 20,
                  }}
                />
                <Tooltip labelClassName="text-[#1B1B1B] text-[16px]" />
                <Line
                  type="linear"
                  dataKey="users"
                  stroke="#2B00B7"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="flex flex-col gap-5 2xl:gap-8 flex-1"
          data-testid="chart"
        >
          <h5 className="text-lg 2xl:text-2xl capitalize leading-[20px] 2xl:leading-1.5 font-bold text-[#1B1B1B] text-center lg:text-left">
            {t("Certificates Issued per Day")}
          </h5>
          <div className="bg-white py-4 px-2 h-80 sm:h-96 2xl:h-[400px] w-full border border-[#DDDDDD]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 25, right: 20, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  stroke="#94A3B8"
                  tick={{
                    fill: "#94A3B8",
                    fontSize:
                      window.innerWidth < 640
                        ? 14
                        : window.innerWidth < 1600
                        ? 16
                        : 20,
                  }}
                  tickMargin={8}
                />
                <YAxis
                  tickMargin={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#94A3B8",
                    fontSize:
                      window.innerWidth < 640
                        ? 14
                        : window.innerWidth < 1600
                        ? 16
                        : 20,
                  }}
                />
                <Bar
                  dataKey="certificates"
                  fill="#7367F029"
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                  activeBar={false}
                  onMouseOver={(_, index, e) => {
                    const target = e.target as SVGElement;
                    target.setAttribute("fill", "#2B00B7");
                  }}
                  onMouseOut={(_, index, e) => {
                    const target = e.target as SVGElement;
                    target.setAttribute("fill", "#7367F029");
                  }}
                  style={{ transition: "fill 0.1s ease 0.1s" }}
                >
                  <LabelList
                    dataKey="certificates"
                    position="top"
                    offset={10}
                    style={{
                      fill: "#4B465C",
                      fontSize:
                        window.innerWidth < 640
                          ? 14
                          : window.innerWidth < 1024
                          ? 16
                          : 20,
                      fontWeight: 500,
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCharts;
