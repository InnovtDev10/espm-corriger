import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const DonutChartFinance = ({ selectedMonth, selectedYear, selectedDay }) => {
  const [financialData, setFinancialData] = useState({
    soldeEnCaisse: 0,
    depense: 0,
    beneficeBrut: 0,
    immobilisation: 0,
  });

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        // Fetch all required data
        const [
          droitsRes,
          fraisRes,
          venteMaterielRes,
          ecolageRes,
          paiementsRes,
          fournituresRes,
          autreDepensesRes,
          immobilisationRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/paiement/droit/all"),
          axios.get("http://localhost:5000/api/paiement/frais/all"),
          axios.get("http://localhost:5000/api/sortiemateriel/all"),
          axios.get("http://localhost:5000/api/paiement/ecolage/all"),
          axios.get("http://localhost:5000/api/paiement/salaire/all"),
          axios.get("http://localhost:5000/api/materiel/all"),
          axios.get("http://localhost:5000/api/autre-depenses/all"),
          axios.get("http://localhost:5000/api/immobilisation/tous"),
        ]);

        const droits = droitsRes.data;
        const frais = fraisRes.data;
        const venteMateriel = venteMaterielRes.data;
        const ecolage = ecolageRes.data.data || [];
        const paiements = paiementsRes.data;
        const fournitures = fournituresRes.data;
        const autreDepenses = autreDepensesRes.data;
        const immobilisation = immobilisationRes.data;

        // Process data
        const currentYear = selectedYear || new Date().getFullYear().toString();
        const currentMonth = selectedMonth ? parseInt(selectedMonth) - 1 : null;

        const processedData = processFinancialData(
          currentYear,
          currentMonth,
          droits,
          frais,
          venteMateriel,
          ecolage,
          paiements,
          fournitures,
          autreDepenses,
          immobilisation
        );

        setFinancialData(processedData);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };

    fetchFinancialData();
  }, [selectedMonth, selectedYear, selectedDay]);

  const processFinancialData = (
    year,
    month,
    droits,
    frais,
    venteMateriel,
    ecolage,
    paiements,
    fournitures,
    autreDepenses,
    immobilisation
  ) => {
    let soldeEnCaisse = 0;
    let depense = 0;
    let immobilisationTotal = 0;

    // Process income data
    droits.forEach((item) => {
      const date = new Date(item.createdAt || item.date);
      if (
        date.getFullYear().toString() === year &&
        (month === null || date.getMonth() === month)
      ) {
        soldeEnCaisse += parseFloat(item.montantPaye || 0);
      }
    });

    frais.forEach((item) => {
      const date = new Date(item.createdAt || item.date);
      if (
        date.getFullYear().toString() === year &&
        (month === null || date.getMonth() === month)
      ) {
        soldeEnCaisse += parseFloat(item.montantPayer || 0);
      }
    });

    venteMateriel.forEach((item) => {
      if (item.natureSortie === "externe") {
        const date = new Date(item.createdAt || item.date);
        if (
          date.getFullYear().toString() === year &&
          (month === null || date.getMonth() === month)
        ) {
          soldeEnCaisse += parseFloat(item.prixTotal || 0);
        }
      }
    });

    ecolage.forEach((item) => {
      const montantParMois = parseFloat(item.montantParMois || 0);
      if (item.moisEffectuer && Array.isArray(item.moisEffectuer)) {
        item.moisEffectuer.forEach((moisInfo) => {
          const date = new Date(moisInfo.date);
          if (
            date.getFullYear().toString() === year &&
            (month === null || date.getMonth() === month)
          ) {
            soldeEnCaisse += montantParMois;
          }
        });
      }
    });

    // Process expenses
    paiements.forEach((item) => {
      const date = new Date(item.createdAt || item.date);
      if (
        date.getFullYear().toString() === year &&
        (month === null || date.getMonth() === month)
      ) {
        depense += parseFloat(item.montant || 0);
      }
    });

    fournitures.forEach((item) => {
      const date = new Date(item.createdAt || item.date);
      if (
        date.getFullYear().toString() === year &&
        (month === null || date.getMonth() === month)
      ) {
        depense += parseFloat(item.prixTotal || 0);
      }
    });

    autreDepenses.forEach((item) => {
      const date = new Date(item.createdAt || item.date);
      if (
        date.getFullYear().toString() === year &&
        (month === null || date.getMonth() === month)
      ) {
        depense += parseFloat(item.montant || 0);
      }
    });

    // Process immobilisation
    immobilisation.forEach((item) => {
      const date = new Date(item.createdAt || item.date);
      if (
        date.getFullYear().toString() === year &&
        (month === null || date.getMonth() === month)
      ) {
        immobilisationTotal += parseFloat(item.montant || 0);
      }
    });

    // Calculate benefice brut
    const beneficeBrut = soldeEnCaisse - depense;

    return {
      soldeEnCaisse,
      depense,
      beneficeBrut,
      immobilisation: immobilisationTotal,
    };
  };

  const series = [
    financialData.soldeEnCaisse,
    financialData.depense,
    financialData.beneficeBrut,
    financialData.immobilisation,
  ];

  const options = {
    chart: {
      type: "donut",
    },
    labels: ["Solde en caisse", "Dépense", "Bénéfice brut", "Immobilisation"],
    colors: ["#008FFB", "#FF4560", "#00E396", "#775DD0"],
    legend: {
      position: "bottom",
      fontFamily: "Poppins",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "%";
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toLocaleString()} Ar`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "16px",
              fontFamily: "Poppins",
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return total.toLocaleString() + " Ar";
              },
            },
          },
        },
      },
    },
    title: {
      text: "Répartition Financière",
      align: "left",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
        fontFamily: "Poppins",
      },
    },
  };

  return (
    <div className="rounded-2xl shadow p-4 bg-white">
      <Chart options={options} series={series} type="donut" height={350} />
    </div>
  );
};

export default DonutChartFinance;
