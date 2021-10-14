<template>
  <v-card>
    <v-card-title class="align-start">
      <span>Weekly Overview</span>

      <v-spacer />

      <v-btn icon small class="mt-n2 me-n3">
        <v-icon size="22">
          {{ icons.mdiDotsVertical }}
        </v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <!-- Chart -->
      <vue-apex-charts
        :options="chartOptions"
        :series="chartData"
        height="210"
      />

      <div class="d-flex align-center">
        <h3 class="text-2xl font-weight-semibold me-4">45%</h3>
        <span
          >Your sales perfomance in 45% 🤩 better compare to last month</span
        >
      </div>

      <v-btn block color="primary" class="mt-6" outlined> Details </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import VueApexCharts from "vue-apexcharts";
// eslint-disable-next-line object-curly-newline
import { mdiDotsVertical, mdiTrendingUp, mdiCurrencyUsd } from "@mdi/js";
import { getCurrentInstance } from "@vue/composition-api";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  components: {
    VueApexCharts,
  },
})
export default class DashboardWeeklyOverview extends Vue {
  icons = {
    mdiDotsVertical,
    mdiTrendingUp,
    mdiCurrencyUsd,
  };

  get chartOptions() {
    // const ins = getCurrentInstance()?.proxy;
    // const $vuetify = ins && ins.$vuetify ? ins.$vuetify : null;
    const customChartColor = this.$vuetify!.theme.dark ? "#3b3559" : "#f5f5f5";

    return {
      colors: [
        customChartColor,
        customChartColor,
        customChartColor,
        customChartColor,
        this.$vuetify!.theme.currentTheme.primary,
        customChartColor,
        customChartColor,
      ],
      chart: {
        type: "bar",
        toolbar: {
          show: false,
        },
        offsetX: -15,
      },
      plotOptions: {
        bar: {
          columnWidth: "40%",
          distributed: true,
          borderRadius: 8,
          startingShape: "rounded",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: ["S", "M", "T", "W", "T", "F", "S"],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        tickPlacement: "on",
        labels: {
          show: false,
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        show: true,
        tickAmount: 4,
        labels: {
          offsetY: 3,
          formatter: (value: any) => `$${value}`,
        },
      },
      stroke: {
        width: [2, 2],
      },
      grid: {
        strokeDashArray: 12,
        padding: {
          right: 0,
        },
      },
    };
  }

  get chartData() {
    return [
      {
        data: [40, 60, 50, 60, 75, 60, 50, 65],
      },
    ];
  }
}
</script>
