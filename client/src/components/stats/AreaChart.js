import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer, BarChart
} from 'recharts'

const AreaChartComponent = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart
                data={data}
                margin={{ top: 25, bottom: 25 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey='date' />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area
                    type='monotone'
                    dataKey="count"
                    stroke="#2cb1bc"
                    fill="#bef8fd"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}
export default AreaChartComponent
