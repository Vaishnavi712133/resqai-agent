export function calculateRisk(
    disaster,
    severity
){

    let score = 0;


    // Severity calculation

    if(severity.toLowerCase()=="high")
    {
        score += 50;
    }

    else if(severity.toLowerCase()=="medium")
    {
        score += 30;
    }

    else
    {
        score += 10;
    }



    // Disaster weight

    const type =
    disaster.toLowerCase();


    if(type=="flood")
    {
        score += 30;
    }

    else if(type=="cyclone")
    {
        score += 40;
    }

    else if(type=="fire")
    {
        score += 35;
    }

    else if(type=="earthquake")
    {
        score += 45;
    }



    if(score>100)
        score=100;



    let level="LOW";


    if(score>=70)
        level="HIGH";

    else if(score>=40)
        level="MEDIUM";



    let action="Monitor situation";


    if(level==="HIGH")
    {
        action=
        "Immediate rescue response required";
    }

    else if(level==="MEDIUM")
    {
        action=
        "Prepare emergency resources";
    }



    return {

        score,

        level,

        action

    };

}