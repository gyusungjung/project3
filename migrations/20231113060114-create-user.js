'use strict';
module.exports = {
  //새로운 테이블을 생성하는 작업
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      nickname: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  //해당 테이블을 삭제하는 작업
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};

//패키지 설치: npm install --save-dev sequelize-cli
//마이그레이션 실행 npx sequelize-cli db:migrate
//되돌리기:npx sequelize-cli db:migrate:undo
