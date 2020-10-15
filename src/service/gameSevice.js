import API from "./API";

export let createGame = async () => {
  return API.post(
      'games',
  )
  .then((response) => {
        if (response.data) {
          return response.data;
        }
        else {
          throw Error("Some Error!!!!")
        }
      }
  )
  .catch((e) => {
    throw e;
  })
};

export let getAllGames = () => {
  return API.get(
      'games',
  )
  .then((response) => {
        if (response.data) {
          return response.data;
        }
        else {
          throw Error("Some Error!!!!")
        }
      }
  )
  .catch((e) => {
    throw e;
  })
};

export let deleteGame = (game, games) => {
  return API.delete(
      'games/' + game.guid,
  ).then((response) => {
    let arr = games;
    let index = arr.indexOf(game);
    if (index !== -1) {
      arr.splice(index, 1);
      return arr;
    }
  })
};

export let resetGameByGuid = (gameGuid) => {
  return API.delete(
      'dices/' + gameGuid,
  ).then((response) => {
    if (response.status === 200) {
      return changeGameStateByGuid(gameGuid, "ACTIVE");
    }
  })
};

export let changeGameStateByGuid = (gameGuid, state) => {
  const updateTo = {
    state: state
  };
  return API.put(
      'games/' + gameGuid, updateTo
  );
};

export let resetGame = (game, games) => {
  return API.delete(
      'dices/' + game.guid,
  ).then((response) => {
    if (response.status === 200) {
      return changeGameState(game, "ACTIVE", games);
    }
  })
};

export let changeGameState = (game, state, games) => {
  const updateTo = {
    state: state
  };
  return API.put(
      'games/' + game.guid, updateTo
  ).then((response) => {
    if (response.data) {
      let arr = games;
      let index = arr.indexOf(game);
      if (index !== -1) {
        arr.splice(index, 1, response.data);
        return arr;
      }
    }
  })
};