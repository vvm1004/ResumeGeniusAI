import { useTheme } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoVietNam } from "@/config/VietNam";
import { tokens } from "@/config/utils";

const data = [
  { id: "VNM", value: 129},
  { id: "VUT", value: 80 },
  { id: "CHN", value: 10 },

];
const domain = [0,100];
const colorRange = ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6"];

const GeographyChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette?.mode);
  return (
    <div style={{ height: 400 ,width: "100%"}}>
    <ResponsiveChoropleth
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      features={geoVietNam.features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      domain={domain}
      unknownColor="#666666"
      label="properties.name"
      valueFormat=".2s"
      colors={colorRange}
      projectionScale={250} 
      projectionTranslation={[0.5,0.5]}
      projectionRotation={[-100, -20, 0]}
      // enableGraticule={true}
      graticuleLineColor="#dddddd"
      borderWidth={0.5}
      borderColor="#152538"
      legends={
          [
              {
                anchor: "bottom-left",
                direction: "column",
                justify: true,
                translateX: 20,
                translateY: -100,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: colors.grey[100],
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#ffffff",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
      }
    />
  </div>
  );
};

export default GeographyChart;
