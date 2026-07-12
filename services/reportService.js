import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { calculateRisk } from "../utils/risk.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const reportFile = path.join(
  __dirname,
  "../data/reports.json"
);


// ===============================
// READ REPORTS
// ===============================

function getReports() {

  try {

    const data = fs.readFileSync(
      reportFile,
      "utf8"
    );


    if (!data.trim()) {
      return [];
    }


    return JSON.parse(data);


  } catch(error) {

    return [];

  }

}



// ===============================
// SAVE REPORTS
// ===============================

function saveReports(reports) {

  fs.writeFileSync(
    reportFile,
    JSON.stringify(
      reports,
      null,
      2
    )
  );

}



// ===============================
// GENERATE REPORT ID
// ===============================

function generateReportId(reports) {


  if(reports.length === 0){

    return "RPT1001";

  }


  let maxId = 1000;


  reports.forEach(report=>{

    const id = parseInt(
      report.reportId.replace("RPT","")
    );


    if(id > maxId){

      maxId=id;

    }

  });


  return `RPT${maxId+1}`;

}



// ===============================
// CREATE REPORT
// ===============================

export function createReport(
  disaster,
  location,
  severity,
  description
){


  const reports = getReports();



  const risk = calculateRisk(
    disaster,
    severity
  );



  const report = {


    reportId:
    generateReportId(reports),


    disaster,


    location,


    severity,


    description,


    // AI Risk Prediction

    riskScore:
    risk.score,


    riskLevel:
    risk.level,


    recommendedAction:
    risk.action,



    status:
    "Pending",



    createdAt:
    new Date().toLocaleString()

  };



  reports.push(report);



  saveReports(reports);



  return report;


}




// ===============================
// GET ALL REPORTS
// ===============================

export function getAllReports(){

    return getReports();

}





// ===============================
// GET REPORT BY ID
// ===============================

export function getReportById(reportId){


    const reports = getReports();


    return reports.find(
        report =>
        report.reportId === reportId
    );

}





// ===============================
// RESOLVE REPORT
// ===============================

export function resolveReport(reportId){


 const reports=getReports();



 const report=reports.find(
    r=>r.reportId===reportId
 );


 if(!report){

    throw new Error(
        "Report not found"
    );

 }



 if(report.status==="Resolved"){

    throw new Error(
        "Report already resolved"
    );

 }



 report.status="Resolved";


 report.resolvedAt =
 new Date().toLocaleString();



 saveReports(reports);



 return report;


}





// ===============================
// PENDING REPORTS
// ===============================

export function getPendingReports(){


 const reports=getReports();


 return reports.filter(
    report =>
    report.status==="Pending"
 );


}





// ===============================
// RESOLVED REPORTS
// ===============================

export function getResolvedReports(){


 const reports=getReports();


 return reports.filter(
    report =>
    report.status==="Resolved"
 );


}





// ===============================
// DELETE REPORT
// ===============================

export function deleteReport(reportId){


 const reports=getReports();



 const index =
 reports.findIndex(
    report =>
    report.reportId===reportId
 );



 if(index===-1){

    throw new Error(
        "Report not found"
    );

 }



 const deletedReport =
 reports[index];



 reports.splice(index,1);



 saveReports(reports);



 return deletedReport;


}





// ===============================
// SEARCH BY DISASTER
// ===============================

export function searchReports(disaster){


 const reports=getReports();


 return reports.filter(
    report =>
    report.disaster.toLowerCase()
    ===
    disaster.toLowerCase()
 );


}





// ===============================
// SEARCH BY LOCATION
// ===============================

export function searchByLocation(location){


 const reports=getReports();


 return reports.filter(
    report =>
    report.location.toLowerCase()
    ===
    location.toLowerCase()
 );


}





// ===============================
// STATISTICS
// ===============================

export function getStatistics(){


 const reports=getReports();



 return {


 total:
 reports.length,


 pending:
 reports.filter(
 r=>r.status==="Pending"
 ).length,


 resolved:
 reports.filter(
 r=>r.status==="Resolved"
 ).length,


 flood:
 reports.filter(
 r=>r.disaster.toLowerCase()
 ==="flood"
 ).length,


 fire:
 reports.filter(
 r=>r.disaster.toLowerCase()
 ==="fire"
 ).length,


 cyclone:
 reports.filter(
 r=>r.disaster.toLowerCase()
 ==="cyclone"
 ).length



 };


}





// ===============================
// DASHBOARD
// ===============================

export function getDashboard(){


 const reports=getReports();



 if(reports.length===0){

    throw new Error(
        "No reports found"
    );

 }



 const dashboard={


 total:
 reports.length,


 pending:
 0,


 resolved:
 0,


 latest:
 reports[reports.length-1]
 .reportId


 };



 const disasterCount={};


 const locationCount={};



 reports.forEach(report=>{


    if(report.status==="Pending")
        dashboard.pending++;


    if(report.status==="Resolved")
        dashboard.resolved++;



    disasterCount[report.disaster]
    =
    (disasterCount[report.disaster]||0)+1;



    locationCount[report.location]
    =
    (locationCount[report.location]||0)+1;



 });



 dashboard.commonDisaster =
 Object.keys(disasterCount)
 .reduce((a,b)=>

 disasterCount[a]>disasterCount[b]
 ?a:b);



 dashboard.commonLocation =
 Object.keys(locationCount)
 .reduce((a,b)=>

 locationCount[a]>locationCount[b]
 ?a:b);



 return dashboard;


}





// ===============================
// RECENT REPORTS
// ===============================

export function getRecentReports(){


 const reports=getReports();


 return reports
 .slice(-5)
 .reverse();


}





// ===============================
// STATUS
// ===============================

export function getStatus(reportId){


 const reports=getReports();



 return reports.find(
    report =>
    report.reportId===reportId
 );


}





// ===============================
// INCIDENT HISTORY
// ===============================

export function getReportHistory(reportId){


 const reports=getReports();



 const report =
 reports.find(
    report =>
    report.reportId===reportId
 );



 if(!report){

    throw new Error(
        "Report not found"
    );

 }



 return report;


}