
export default function time (time, callback) {
  console.log(time);
  if (time >= 5 && time <= 9) {
    callback("Good morning");
  }
  else if (time >= 10 && time <= 12) {
    callback("Good day");
  }

  else if (time >= 13 && time <= 17) {
    callback("Good afternoon");
  }

  else if (time >= 18 && time <= 22) {
    callback("Good evening");
  }

  else {
    callback("Good night");
  }
}
