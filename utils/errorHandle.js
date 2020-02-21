module.exports = () => {
  process.once('uncaughtException', (err) => {
    console.log(
      '\n错误类型 [uncaughtException]:' + err.message + '\n' + err.stack
    );
  });

  process.on('unhandledRejection', (err) => {
    console.log('\n错误类型 [unhandledRejection:' + JSON.stringify(err));
  });

  process.on('exit', function() {});
};
