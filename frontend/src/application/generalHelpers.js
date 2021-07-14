

export function machineOrHuman(d){
    if(d['Transmission Mode'] === "Boundry Crossing/M-H" || d['Transmission Mode'] === "Non-Boundary/M-M"){ return "machine"}
    else if(d['Transmission Mode'] === "Boundry Crossing/H-M" || d['Transmission Mode'] === "Non-Boundary/H-H" ){
      return "human"
    }
  }