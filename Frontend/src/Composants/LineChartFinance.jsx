import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const LineChartFinance = ({ selectedYear }) => {
  const [financialData, setFinancialData] = useState({
    soldeEnCaisse: Array(12).fill(0),
    depense: Array(12).fill(0),
    beneficeBrut: Array(12).fill(0),
    immobilisation: Array(12).fill(0),
  });

  const months = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];
  const [categories, setCategories] = useState(months);
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
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
          axios.get(`${url}/api/paiement/droit/all`, {headers: {'Cache-Control': 'no-cache'}}),
          axios.get(`${url}/api/paiement/frais/all`, {headers: {'Cache-Control': 'no-cache'}}),
          axios.get(`${url}/api/sortiemateriel/all`, {headers: {'Cache-Control': 'no-cache'}}),
          axios.get(`${url}/api/paiement/ecolage/all`, {headers: {'Cache-Control': 'no-cache'}}),
          axios.get(`${url}/api/paiement/salaire/all`, {headers: {'Cache-Control': 'no-cache'}}),
          axios.get(`${url}/api/materiel/all`, {headers: {'Cache-Control': 'no-cache'}}),
          axios.get(`${url}/api/autre-depenses/all`, {headers: {'Cache-Control': 'no-cache'}}),
          axios.get(`${url}/api/immobilisation/tous`, {headers: {'Cache-Control': 'no-cache'}}),
        ]);

        const droits = droitsRes.data;
        const frais = fraisRes.data;
        const venteMateriel = venteMaterielRes.data;
        const ecolage = ecolageRes.data.data || [];
        const paiements = paiementsRes.data;
        const fournitures = fournituresRes.data;
        const autreDepenses = autreDepensesRes.data;
        const immobilisation = immobilisationRes.data;

        const currentYear = selectedYear || new Date().getFullYear().toString();
        const monthlyData = processMonthlyData(
          currentYear,
          droits,
          frais,
          venteMateriel,
          ecolage,
          paiements,
          fournitures,
          autreDepenses,
          immobilisation
        );

        setFinancialData(monthlyData);
        setCategories(months);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };

    fetchFinancialData();
  }, [selectedYear]);

  const processMonthlyData = (
    year,
    droits,
    frais,
    venteMateriel,
    ecolage,
    paiements,
    fournitures,
    autreDepenses,
    immobilisation
  ) => {
    const soldeEnCaisse = Array(12).fill(0);
    const depense = Array(12).fill(0);
    const beneficeBrut = Array(12).fill(0);
    const immobilisationData = Array(12).fill(0);

    // Process each dataset by month
    droits.forEach((item) => {
      const date = new Date(item.createdAt || item.date);
      if (date.getFullYear().toString() === year) {
        const month = date.getMonth();
        soldeEnCaisse[month] += parseFloat(item.montantPaye || 0);
      }
    });

    frais.forEach((item) => {
      const date = new Date(item.createdAt || item.date);
      if (date.getFullYear().toString() === year) {
        const month = date.getMonth();
        soldeEnCaisse[month] += parseFloat(item.montantPayer || 0);
      }
    });

    venteMateriel.forEach((item) => {
      if (item.natureSortie === "externe") {
        const date = new Date(item.createdAt || item.date);
        if (date.getFullYear().toString() === year) {
          const month = date.getMonth();
          soldeEnCaisse[month] += parseFloat(item.prixTotal || 0);
        }
      }
    });

    ecolage.forEach((item) => {
      const montantParMois = parseFloat(item.montantParMois || 0);
      if (item.moisEffectuer && Array.isArray(item.moisEffectuer)) {
        item.moisEffectuer.forEach((moisInfo) => {
          const date = new Date(moisInfo.date);
          if (date.getFullYear().toString() === year) {
            const month = date.getMonth();
            soldeEnCaisse[month] += montantParMois;
          }
        });
      }
    });

    // Process expenses
    paiements.forEach((item) => {
      const date = new Date(item.createdAt || item.date);
      if (date.getFullYear().toString() === year) {
        const month = date.getMonth();
        depense[month] += parseFloat(item.montant || 0);
      }
    });

    fournitures.forEach((item) => {
      const date = new Date(item.createdAt || item.date);
      if (date.getFullYear().toString() === year) {
        const month = date.getMonth();
        depense[month] += parseFloat(item.prixTotal || 0);
      }
    });

    autreDepenses.forEach((item) => {
      const date = new Date(item.createdAt || item.date);
      if (date.getFullYear().toString() === year) {
        const month = date.getMonth();
        depense[month] += parseFloat(item.montant || 0);
      }
    });

    // Process immobilisation
    immobilisation.forEach((item) => {
      const date = new Date(item.createdAt || item.date);
      if (date.getFullYear().toString() === year) {
        const month = date.getMonth();
        immobilisationData[month] += parseFloat(item.montant || 0);
      }
    });

    // Calculate benefice brut
    for (let i = 0; i < 12; i++) {
      beneficeBrut[i] = soldeEnCaisse[i] - depense[i];
    }

    // Retourner les données pour tous les mois de janvier à décembre
    return {
      soldeEnCaisse: soldeEnCaisse,
      depense: depense,
      beneficeBrut: beneficeBrut,
      immobilisation: immobilisationData,
    };
  };

  const series = [
    {
      name: "Solde en caisse",
      data: financialData.soldeEnCaisse,
    },
    {
      name: "Dépense",
      data: financialData.depense,
    },
    {
      name: "Bénéfice brut",
      data: financialData.beneficeBrut,
    },
    {
      name: "Immobilisation",
      data: financialData.immobilisation,
    },
  ];

  const options = {
    chart: {
      type: "line",
      toolbar: {
        show: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    title: {
      text: "Suivi Financier",
      align: "left",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
        fontFamily: "Poppins",
      },
    },
    xaxis: {
      categories: categories,
    },
    legend: {
      position: "bottom",
      fontFamily: "Poppins",
    },
    colors: ["#008FFB", "#FF4560", "#00E396", "#775DD0"],
    tooltip: {
      y: {
        formatter: (val) => `${val.toLocaleString()} Ar`,
      },
    },
  };

  return (
    <div className="rounded-2xl shadow p-4 bg-white">
      <Chart options={options} series={series} type="line" height={340} />
    </div>
  );
};

export default LineChartFinance;
