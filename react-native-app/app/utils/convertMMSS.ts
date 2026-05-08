export const convertMMSS = (time: number, eventType : string): string => {
  
  
  if (eventType !='333mbf') {
    let mins: number = 0;
    let seconds: number = Math.floor(time / 100);
    let mill: number = time % 100;
    let label: string = "";

    if (seconds > 59) {
      mins = Math.floor(seconds / 60);
      seconds = seconds - (mins*60);
    if (mins > 1) {
      label = "minutes";
    } else {
      label = "minute";
    }
  } else {
    label = "s";
  }
 
  return  mins > 0
      ? `${mins}:${seconds}.${mill} ${label}`
      : `${seconds}.${mill}${label}`;
  } else {
    //At 3x3 Multiples bld, the 'time' in DB is a pattern with multiples informations.
    //It's mean we need to convert into string to read the data correctly.
    const timeForIndex = time.toString()
    //Différence = 99 - the score (solved - missed)
    const difference = 99 - parseInt(timeForIndex.substring(0,2))
    const timeInMin = parseInt(timeForIndex.substring(2,7))
    const missed = parseInt(timeForIndex.substring(7,9))
    const solved = difference + missed
    const attempted = solved + missed
    //If hour is reached 
  
      return `${solved}/${attempted} ${timeInMin>3600 ? '1:' : ''} ${Math.floor(timeInMin/60)%60}:${timeInMin%60 > 9 ? timeInMin%60 : timeInMin%60 + '0' }`
    }
 
};
