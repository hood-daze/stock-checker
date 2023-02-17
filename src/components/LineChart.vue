<template>
    <Line :data="data" :options="options" :width="1000"/>
</template>

<script setup>
import axios from "axios";

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
const data = ref({
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
        text: 'Chart.js Line Chart'
      }
    }
  })

const processing = ref(false);
const dialog = ref(false);
const dialogMessage = ref("");

async function postStockInfo() {
  try {
      processing.value = true;
      const res = await axios.post(
        `${import.meta.env.API_URL}post-stock-info`,
        {},
        { headers: { Authorization: `Bearer ${liff.getIDToken()}` } }
      );      
      // 取得したデータをデータに入れる。
  } catch (e) {
    dialogMessage.value = "データ取得に失敗しました。";
    dialog.value = true;
  }finally{
    processing.value = false;
  }
}

async function postStockInfoDummy() {
  try {
      processing.value = true;
      chartData.value = ref({
        labels: [ 'January', 'February', 'March' ],
        datasets: [ { data: [40, 20, 12] } ]
      });

  } catch (e) {
    dialogMessage.value = "データ取得に失敗しました。";
    dialog.value = true;
  }finally{
    processing.value = false;
  }
}
</script>
