lockState = { isLocked: true };

const lock = () => {
  lockState.isLocked = true;
};

const unlock = () => {
  lockState.isLocked = false;
};

const isLocked = () => {
  lockState.isLocked;
};

module.exports = { lock, unlock, isLocked };
