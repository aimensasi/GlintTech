import { restaurants } from "./data/restaurants";
import { users } from "./data/users";
import { PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';
import * as Argon from 'argon2';
import * as moment from "moment";


const client = new PrismaClient();


async function seedOpeningHours(id, times){
  const multiDayRegex = /^(Mon|Fri|Tues|Weds|Thurs|Sat|Sun), (Mon|Fri|Tues|Weds|Thurs|Sat|Sun)/;
  const singleDayRegex = /^(Mon|Fri|Tues|Weds|Thurs|Sat|Sun)/;
  for (let openTime of times){
    const multiDays = openTime.match(multiDayRegex);
    const singleDay = openTime.match(singleDayRegex);

    if(multiDays){
      const [firstDay, secondDay] = multiDays[0].split(", ");
      const [from, to] = openTime.substring(multiDays[0].length).trim().split(" - ")
      const fromTime = moment(from, 'h:m a').format('HH:mm')
      const toTime = moment(to, 'h:m a').format('HH:mm')

      await client.openingHour.create({
        data: {
          restaurantId: id,
          day: firstDay,
          fromTime: fromTime,
          toTime: toTime
        }
      })

      await client.openingHour.create({
        data: {
          restaurantId: id,
          day: secondDay,
          fromTime: fromTime,
          toTime: toTime
        }
      })
    } else if(singleDay){
      const day = singleDay[0];
      const [from, to] = openTime.substring(day.length).trim().split(" - ")
      const fromTime = moment(from, 'h:m a').format('HH:mm')
      const toTime = moment(to, 'h:m a').format('HH:mm')

      await client.openingHour.create({
        data: {
          restaurantId: id,
          day,
          fromTime: fromTime,
          toTime: toTime
        }
      })
    }
  }
}

async function seedRestaurants(){
  const multiDayRegex = /^(Mon|Fri|Tues|Weds|Thurs|Sat|Sun), (Mon|Fri|Tues|Weds|Thurs|Sat|Sun)/;
  const singleDayRegex = /^(Mon|Fri|Tues|Weds|Thurs|Sat|Sun)/;
  // const days = time.match(daysRegex)[0];
  // const [from, to] = time.substring(days.length).trim().split(" - ")
  // const fromTime = moment(from, 'h:m a').format('h:mm a')
  // const toTime = moment(to, 'h:m a').format('h:mm a')


  for (let restaurant of restaurants){
    const times = restaurant.openingHours.split(" / ");

    const averageDishPrice = restaurant.menu.reduce((a, b) => a + b.price, 0) / restaurant.menu.length;
    const createdRestaurant = await client.restaurant.create({
      data: {
        name: restaurant.restaurantName,
        cashBalance: restaurant.cashBalance,
        menuSize: restaurant.menu.length,
        averageDishPrice: Math.round((averageDishPrice + Number.EPSILON) * 100) / 100,
      }
    });

    for (let dish of restaurant.menu){
      await client.dish.create({
        data: {
          restaurantId: createdRestaurant.id,
          name: dish.dishName,
          price: dish.price,
        }
      })
    }

    await seedOpeningHours(createdRestaurant.id, times);
  }
}

async function seedUsers(){
  const hashedPassword = await Argon.hash("password");
  for (let user of users){
    const createdUser = await client.user.create({
      data: {
        email: faker.internet.email(),
        password: hashedPassword,
        name: user.name,
        cashBalance: user.cashBalance
      }
    });

    for (let order of user.purchaseHistory){
      const restaurant = await client.restaurant.findFirst({
        where: { name: order.restaurantName },
      })


      if(!restaurant) {
        continue;
      }

      await client.order.create({
        data: {
          restaurantId: restaurant.id,
          userId: createdUser.id,
          dishName: order.dishName,
          price: order.transactionAmount
        }
      });
    }
  }
}


async function main(){
  await seedRestaurants();
  await seedUsers();
}


main().then(() => {
  console.log("Seeding is complete");
  process.exit(0);
}).catch((e) => {
  console.error("Seeder Failed", e);
  process.exit(1);
});
