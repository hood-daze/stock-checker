<template>
    

    <div id="graph-area" class="border rounded-md p-10 mb-10">
      <Line :data="chartdata" :options="options" :width="1800" :height="500"/>
    </div>

    
    <Form class="border rounded-md p-4 w-6/12 mx-auto" 
          @submit="onSubmit"
          @invalid-submit="onInvalidSubmit">
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="symbol">
          シンボル
        </label>
        <Field class="appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        name="symbol"
        :rules="validateSymbol"
        type="text"
        placeholder="（例：AAPL）"/>
        <ErrorMessage class="text-red-500 font-semibold"
        name="symbol" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="pickedFrom">
          開始日時
        </label>
        <Datepicker class="appearance-none w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        v-model="pickedFrom"
        name="pickedFrom"
        :locale="locale"
        :upperLimit="pickedTo"/>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="pickedTo">
          終了日時
        </label>
          <Datepicker class="appearance-none w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            name="pickedTo"
            v-model="pickedTo"
            :locale="locale"
            :lowerLimit="pickedFrom"/>
      </div>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded submit-btn" 
        :disabled="isLoading">        
        <span v-if="isLoading" class="flex">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Prpcessing...
        </span>
        <span v-else>
          株価の取得
        </span>
      </button>

    </form>
  
</template>

<script setup>
import { ColorUtill } from '../color-utill'
import { ja } from 'date-fns/locale'
import axios from "axios";
import Datepicker from "vue3-datepicker"
import { Form, Field, ErrorMessage} from 'vee-validate';
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

const pickedFrom = ref(new Date())
const pickedTo = ref(new Date())
const isLoading = ref(false)

const chartdata = ref({
  labels: ['1900/01/01', '1900/01/02', '1900/01/03', '1900/01/04'],
  datasets: [
    {
      label: 'SAMPLE LABEL',
      borderColor: '#f87979',
      backgroundColor: '#f87979',
      data: [20, 39, 10, 40]
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
        text: 'SAMPLE SYMBOL'
      }
    }
  })

const locale= ref(ja)

function onInvalidSubmit() {
  const submitBtn = document.querySelector('.submit-btn');
  submitBtn.classList.add('invalid');
  setTimeout(() => {
    submitBtn.classList.remove('invalid');
  }, 1000);
}

async function onSubmit(values) {
  console.log(values.symbol);
  console.log(values.pickedFrom);
  console.log(values.pickedTo);

  try {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000));    
    const jsonString = '{"1641340800000":{"Open":179.6100006104,"High":180.1699981689,"Low":174.6399993896,"Close":174.9199981689,"Adj Close":173.6455383301,"Volume":94537600},"1641427200000":{"Open":172.6999969482,"High":175.3000030518,"Low":171.6399993896,"Close":172.0,"Adj Close":170.7468109131,"Volume":96904000},"1641513600000":{"Open":172.8899993896,"High":174.1399993896,"Low":171.0299987793,"Close":172.1699981689,"Adj Close":170.9155883789,"Volume":86709100}}';
    // JSONパース
    const jsonData = JSON.parse(jsonString);

    const labels = [];
    const dataOpne = [];
    const dataHigh = [];
    const dataLow = [];
    const dataClose = [];
    const dataAdjClose = [];
    const dataVolume = [];

    // ループ処理
    for (const date in jsonData) {
      if (jsonData.hasOwnProperty(date)) {
        const data = jsonData[date];
        labels.push(new Date(parseInt(date)).toLocaleString('ja-JP', {
          timeZone: 'Asia/Tokyo',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour12: false,
        }))
        
        dataOpne.push(data.Open);
        dataHigh.push(data.High);
        dataLow.push(data.Low);
        dataClose.push(data.Close);
        // dataAdjClose.push(data['Adj Close']);
        // dataVolume.push(data.Volume);
      }
    }
    chartdata.value = {
      labels: labels,
      datasets: [
        {
          label: 'Open',
          borderColor: ColorUtill.GREEN_COLOR_CODE,
          backgroundColor: ColorUtill.transparentize(ColorUtill.GREEN_COLOR_CODE, 0.5),
          data: dataOpne
        },
        {
          label: 'High',
          borderColor: ColorUtill.RED_COLOR_CODE,
          backgroundColor: ColorUtill.transparentize(ColorUtill.RED_COLOR_CODE, 0.5),
          data: dataHigh
        },
        {
          label: 'Low',
          borderColor: ColorUtill.BLUE_COLOR_CODE,
          backgroundColor: ColorUtill.transparentize(ColorUtill.BLUE_COLOR_CODE, 0.5),
          data: dataLow
        },
        {
          label: 'Close',
          borderColor: ColorUtill.SCARRET_COLOR_CODE,
          backgroundColor: ColorUtill.transparentize(ColorUtill.SCARRET_COLOR_CODE, 0.5),
          data: dataClose
        },
        // {
        //   label: 'Adj Close',
        //   borderColor: '#ffdb58',
        //   backgroundColor: transparentize('#ffdb58', 0.5),
        //   data: dataAdjClose
        // },
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
          text: values.symbol
        }
      }
    }   
  } catch (e) {
    console.log(e)
  }finally{
    isLoading.value = false
  }
}

function validateSymbol(value) {
    // if the field is empty
    if (!value) {
      return 'このフィールドは必須です。';
    }
    return true;
}

</script>
<style>
.submit-btn {
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.submit-btn.invalid {
  animation: shake 0.5s;
  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

.submit-btn:hover {
  transform: scale(1.1);
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px);
  }
  10% {
    transform: translate(-1px, -2px);
  }
  20% {
    transform: translate(-3px, 0px);
  }
  30% {
    transform: translate(3px, 2px);
  }
  40% {
    transform: translate(1px, -1px);
  }
  50% {
    transform: translate(-1px, 2px);
  }
  60% {
    transform: translate(-3px, 1px);
  }
  70% {
    transform: translate(3px, 1px);
  }
  80% {
    transform: translate(-1px, -1px);
  }
  90% {
    transform: translate(1px, 2px);
  }
  100% {
    transform: translate(1px, -2px);
  }
}
</style>