<template>
  
    <Line :data="chartdata" :options="options" :width="1400" :height="500"/>
    <button @click="postStockInfoDummy">モックAPI</button>


    <div id="form" class="border rounded-md p-4 w-6/12 mx-auto">
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="symbol">
          シンボル
        </label>
        <input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        id="symbol" type="text" v-model="symbol" placeholder="（例：AAPL）">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="pickedFrom">
          取得開始日時
        </label>
        <Datepicker class="appearance-none w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        v-model="pickedFrom" id="pickedFrom" 
        :upperLimit="pickedTo"/>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="pickedTo">
          取得期限日時
        </label>
          <Datepicker class="appearance-none w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            v-model="pickedTo" id="pickedTo" 
            :lowerLimit="pickedFrom"/>
      </div>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
        株価の取得
      </button>
    </div>
    

</template>

<script setup>
import axios from "axios";
import Datepicker from "vue3-datepicker"

import { ref, onMounted } from "vue";
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const symbol = ref("")
const pickedFrom = ref(new Date())
const pickedTo = ref(new Date())

const chartdata = ref({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#f87979',
      data: [-40, 39, 10, 40, 39, 80, 100]
    }
  ]
})

const options = ref({
    responsive: true,
    
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '株価推移チャート'
      }
    }
  })

async function postStockInfoDummy() {
  try {
    var jsonString = '{"1641340800000":{"Open":179.6100006104,"High":180.1699981689,"Low":174.6399993896,"Close":174.9199981689,"Adj Close":173.6455383301,"Volume":94537600},"1641427200000":{"Open":172.6999969482,"High":175.3000030518,"Low":171.6399993896,"Close":172.0,"Adj Close":170.7468109131,"Volume":96904000},"1641513600000":{"Open":172.8899993896,"High":174.1399993896,"Low":171.0299987793,"Close":172.1699981689,"Adj Close":170.9155883789,"Volume":86709100}}';
    // JSONパース
    var jsonData = JSON.parse(jsonString);

    var labels = [];
    var dataOpne = [];
    var dataHigh = [];
    var dataLow = [];
    var dataClose = [];
    var dataAdjClose = [];
    var dataVolume = [];

    // ループ処理
    for (var date in jsonData) {
      if (jsonData.hasOwnProperty(date)) {
        var data = jsonData[date];
        labels.push(new Date(parseInt(date)).toDateString())
        dataOpne.push(data.Open);
        dataHigh.push(data.High);
        dataLow.push(data.Low);
        dataClose.push(data.Close);
        dataAdjClose.push(data['Adj Close']);
        dataVolume.push(data.Volume);
      }
    }
    chartdata.value = {
      labels: labels,
      datasets: [
        {
          label: 'Open',
          borderColor: '#f87979',
          backgroundColor: transparentize('#f87979', 0.5),
          data: dataOpne
        },
        {
          label: 'High',
          backgroundColor: '#a3f7bf',
          data: dataHigh
        },
        {
          label: 'Low',
          backgroundColor: '#ffdb58',
          data: dataLow
        },
        {
          label: 'Close',
          backgroundColor: '#ab3f5b',
          data: dataClose
        },
        {
          label: 'Adj Close',
          backgroundColor: '#a1caf1',
          data: dataAdjClose
        },
        // {
        //   label: 'Volume',
        //   backgroundColor: '#e6e6fa',
        //   data: dataVolume
        // }
      ]
    }

    options.value = {
      responsive: true,
      
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Apple' + '株価チャート'
        }
      }
    }

    
    console.log("complete")
  } catch (e) {
    console(e)
  }finally{

  }
}

function transparentize(hex, opacity) {
  hex = hex.replace('#', '');
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
}
</script>
