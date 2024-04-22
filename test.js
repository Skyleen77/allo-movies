const test = async () => {
  await fetch('http://localhost:3000/api/send-notification');
  console.log('Notification sent!');
};
test();
