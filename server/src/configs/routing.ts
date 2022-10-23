export default (MODE: string) => {
  console.log(MODE);
  const POST = {
    v1: {
      // generalRoutes: [{
      //   path: "",
      //   controller: null
      // }],
    },
  };

  const GET = {
    v1: {
      // generalRoutes: [
      //   {
      //     path: "",
      //     controller: null
      //   }
      // ],
    },
  };

  return {
    POST,
    GET,
  };
};
