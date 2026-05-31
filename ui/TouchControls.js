import Phaser from 'phaser';

function isTouchDevice(scene) {
  return Boolean(scene.sys.game.device.input.touch);
}

export function createTouchControls(scene, { showJump = true } = {}) {
  const enabled = isTouchDevice(scene);

  const state = {
    enabled,
    left: false,
    right: false,
    jumpJustPressed: false,
  };

  if (!enabled) {
    return {
      state,
      consumeJump() {
        return false;
      },
      destroy() {},
    };
  }

  const { width, height } = scene.scale;
  const btnSize = Math.min(120, Math.max(80, Math.floor(Math.min(width, height) * 0.14)));
  const margin = Math.max(12, Math.floor(btnSize * 0.15));

  const style = {
    fontSize: `${Math.floor(btnSize * 0.25)}px`,
    fill: '#fff',
    backgroundColor: '#000',
    padding: { x: 10, y: 6 },
  };

  const makeHoldButton = ({ x, y, text, onDown, onUp }) => {
    const rect = scene.add
      .rectangle(x, y, btnSize, btnSize, 0x000000, 0.35)
      .setOrigin(0, 1)
      .setScrollFactor(0)
      .setDepth(180)
      .setInteractive({ useHandCursor: true });

    const label = scene.add
      .text(x + btnSize / 2, y - btnSize / 2, text, style)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(181);

    const up = () => {
      onUp();
      rect.setFillStyle(0x000000, 0.35);
    };

    rect.on('pointerdown', () => {
      onDown();
      rect.setFillStyle(0x000000, 0.55);
    });

    rect.on('pointerup', up);
    rect.on('pointerout', up);
    rect.on('pointerupoutside', up);

    return { rect, label };
  };

  const leftBtn = makeHoldButton({
    x: margin,
    y: height - margin,
    text: 'IZQ',
    onDown: () => {
      state.left = true;
    },
    onUp: () => {
      state.left = false;
    },
  });

  const rightBtn = makeHoldButton({
    x: margin + btnSize + margin,
    y: height - margin,
    text: 'DER',
    onDown: () => {
      state.right = true;
    },
    onUp: () => {
      state.right = false;
    },
  });

  let jumpBtn = null;
  if (showJump) {
    jumpBtn = makeHoldButton({
      x: width - margin - btnSize,
      y: height - margin,
      text: 'SALTAR',
      onDown: () => {
        state.jumpJustPressed = true;
      },
      onUp: () => {},
    });
  }

  return {
    state,
    consumeJump() {
      const was = state.jumpJustPressed;
      state.jumpJustPressed = false;
      return was;
    },
    destroy() {
      leftBtn.rect.destroy();
      leftBtn.label.destroy();
      rightBtn.rect.destroy();
      rightBtn.label.destroy();
      if (jumpBtn) {
        jumpBtn.rect.destroy();
        jumpBtn.label.destroy();
      }
    },
  };
}

export function anyLeft(scene, keyboardKey, touchState) {
  return Boolean(keyboardKey?.isDown) || Boolean(touchState?.left);
}

export function anyRight(scene, keyboardKey, touchState) {
  return Boolean(keyboardKey?.isDown) || Boolean(touchState?.right);
}

export function anyJumpJustPressed(scene, keyboardKey, touchControls) {
  const kb = keyboardKey ? Phaser.Input.Keyboard.JustDown(keyboardKey) : false;
  const touch = touchControls?.consumeJump ? touchControls.consumeJump() : false;
  return kb || touch;
}
