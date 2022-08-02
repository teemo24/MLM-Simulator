
'use strict';

function bonusUp(networkers, parent_id, bonus){
    if(parent_id == 0) return true;
    else{
        for(var k=0; k < networkers.length; ++k){
            if(networkers[k].id == parent_id){
                networkers[k].solde += bonus;
                bonusUp(networkers, networkers[k].parent_id, bonus);
                break;
            }
        }
    }
}

const main = (inputs)=>{
    let all = 0;
    let id = 0
    let parent_id = id;
    let bonus = inputs.price * (inputs.commission / 100);
    let networkers = [];
    let parent_ids = [ parent_id ];
    let grandParent_ids = [ parent_id ];
    let withdraw = 0;
    let maxLevel = inputs.max_level;
    let childValue = inputs.child;
    let platfontValue = inputs.platfont;

    let outputs = {
        subscribers:0,
        all_gain:0,
        gain_of_subsribers:0,
        first_subscriber_gain:0,
        company_gain:0,
        subscribers_earned:0,
        subscribers_not_earned:0,
        winners_percent:0
    };

    for(var level = 0; level <= maxLevel; ++level){
        let p = -1;
        let pkey = 0;
        let children = [];
        let grandParent;
        let pid;
        for(var i = 0; i < Math.pow(childValue, level); ++i){

            all++;

            if(++p == childValue){
                p = 0;
                ++pkey;
            }
            grandParent = grandParent_ids[pkey];

            pid = ++id;

            networkers.push({
                id:pid,
                level:level,
                solde:0,
                withdrawed:0,
                withdrawLimit:platfontValue,
                parent_id:grandParent
            });

            bonusUp(networkers, grandParent, bonus);

            children.push(pid);

        }
        
        grandParent_ids = children;
        parent_ids = parent_ids.concat(children);

        networkers.forEach(networker =>{
            if(networker.solde >= networker.withdrawLimit && networker.withdrawed < inputs.maxWithdrawed){
                withdraw += networker.solde;
                networker.withdrawed += networker.solde;
                networker.solde = 0;
                networker.withdrawLimit *= inputs.withdrawLimit;
            }
        });
    }

    let c = 0;
    networkers.forEach(networker =>{
        if(networker.withdrawed > 0){
            ++c;
        }
    });

    outputs.all_gain = inputs.price * all;
    outputs.subscribers = all; 
    outputs.gain_of_subsribers = withdraw;
    outputs.first_subscriber_gain = networkers[0].withdrawed;
    outputs.company_gain = outputs.all_gain  - withdraw;
    outputs.subscribers_earned = c; 
    outputs.subscribers_not_earned = all - c; 
    outputs.winners_percent = parseFloat((c/(all-c)) * 100).toFixed(2);

    console.log(outputs);

    return networkers;
}

const inputs = {
    child:2,
    price:50,
    commission:10,
    platfont:50,
    max_level:10, 
    maxWithdrawed:20000,
    withdrawLimit:2
}
let timeStart = Date.now();
main(inputs);
console.log("Execution time: "+(Date.now()-timeStart)+"ms");

// const fs = require('fs');
// let networkers = main(inputs);
// let data = JSON.stringify(networkers);
// fs.writeFileSync('networkers.json', data);
