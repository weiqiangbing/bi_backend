<template>
  <div id="main" class="app-container chart-container">	 
	<!-- <chart width="100%" height="100%"></chart> -->
  </div>	
</template>

<script>
// import Chart from '@/components/Charts/MixChart'
var Echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

export default {
	name: 'Echarts',
	// components: {
	// 	Chart
	// },
	data() {
		return {
			
		}
	},
	created() {
	},
	mounted() {
		this.initChart()
	},
	methods: {		
		initChart(){
			var myChart = Echarts.init(document.getElementById('main'))
			myChart.setOption({
				legend: {
					x: '5%',
					top: '10%',
					textStyle: {
						color: '#90979c'
					},
					data: ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie']
				},
				tooltip: {},
				dataset: {
					// 提供一份数据。
					source: [
						['product', '2015', '2016', '2017'],
						['Matcha Latte', 43.3, 85.8, 93.7],
						['Milk Tea', 83.1, 73.4, 55.1],
						['Cheese Cocoa', 86.4, 65.2, 82.5],
						['Walnut Brownie', 72.4, 53.9, 39.1]
					]
				},
				// 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
				xAxis: {type: 'category'},
				// 声明一个 Y 轴，数值轴。
				yAxis: {},
				// 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
				series: [
					{type: 'bar'},
					{type: 'bar'},
					{type: 'bar'}
				]
			})
		}

	}
}
</script>

<style lang="scss">
.chart-container{
	// position: relative;
	width: 100%;
	height: calc(100vh - 100px);
}
</style>
