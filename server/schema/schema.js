const graphql = require('graphql');
const fs = require('fs');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLList
} = graphql;

let data = JSON.parse(fs.readFileSync('./data/data.json', 'utf-8'));

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		waste_history: {
			type: new GraphQLList(WasteType)
		}
	})
})

const WasteType = new GraphQLObjectType({
	name: 'Waste',
	fields: () => ({
		date: { type: GraphQLString },
		amount: { type: GraphQLString },
		type: { type: GraphQLString },
		userId: { type: GraphQLString }
	})
})

const PlasticsProductionType = new GraphQLObjectType({
	name: 'Global',
	fields: () => ({
		year: { type: GraphQLString },
		tonnes: { type: GraphQLString }
	})
})

const RecycledType = new GraphQLObjectType({
	name: 'Recycled',
	fields: () => ({
		year: { type: GraphQLString },
		tonnes: { type: GraphQLString }
	})
})

const IncineratedType = new GraphQLObjectType({
	name: 'Incinerated',
	fields: () => ({
		year: { type: GraphQLString },
		tonnes: { type: GraphQLString }
	})
})

const DiscardedType = new GraphQLObjectType({
	name: 'Discarded',
	fields: () => ({
		year: { type: GraphQLString },
		tonnes: { type: GraphQLString }
	})
})

const NewsType = new GraphQLObjectType({
	name: 'news',
	fields: () => ({
		date: { type: GraphQLString },
		heading: { type: GraphQLString },
		text: { type: GraphQLString },
		source: { type: GraphQLString }
	})
})

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addUser: {
			type: UserType,
			args: {
				id: { type: GraphQLString },
				name: { type: GraphQLString },
			},
			resolve(parent, args) {
				let user = {
					id: args.id,
					name: args.name,
					waste_history: [],
				}
				data.data.users = [...data.data.users, user];
				const newData = JSON.stringify(data);
				fs.writeFileSync('./data/data.json', newData, 'utf-8');
				console.log(user);
				return user;
			}
		},
		addWaste: {
			type: WasteType,
			args: {
				date: { type: GraphQLString },
				amount: { type: GraphQLString },
				type: { type: GraphQLString },
				userId: { type: GraphQLString }
			},
			resolve(parent, args) {
				let waste = {
					date: args.date,
					amount: args.amount,
					type: args.type,
					userId: args.userId
				}
				const newArr = data.data.users.map(user => {
					if (user.id === args.userId) {
						const wasteArr = user.waste_history ? [...user.waste_history, waste] : [waste];
						return { ...user, waste_history: wasteArr }
					}
					return { ...user }
				})
				data.data.users = newArr;
				const newData = JSON.stringify(data);
				fs.writeFileSync('./data/data.json', newData, 'utf-8');
				return args;
			}
		},
		removeWaste: {
			type: WasteType,
			args: {
				userId: { type: GraphQLString },
				date: { type: GraphQLString }
			},
			resolve(parent, args) {
				console.log(data.data.users[0].waste_history)
				const newArr = data.data.users.map(user => {
					if (user.id === args.userId) {
						const newWasteArr = user.waste_history.filter(waste => waste.date !== args.date);
						console.log(newWasteArr)
						return { ...user, waste_history: newWasteArr }
					}
					return { ...user }
				})
				data.data.users = newArr;
				const newData = JSON.stringify(data);
				fs.writeFileSync('./data/data.json', newData, 'utf-8');
				return args;
			}
		},
		updateWaste: {
			type: WasteType,
			args: {
				date: { type: GraphQLString },
				amount: { type: GraphQLString },
				type: { type: GraphQLString },
				userId: { type: GraphQLString }
			},
			resolve(parent, args) {
				let wasteObj = {
					date: args.date,
					amount: args.amount,
					type: args.type,
					userId: args.userId
				}

				const newArr = data.data.users.map(user => {
					if (user.id === args.userId) {
						const newWasteArr = user.waste_history.map(waste => {
							if (waste.date === args.date) {
								return { ...wasteObj };
							}
							return { ...waste }
						});
						return { ...user, waste_history: newWasteArr }
					}
					return { ...user }
				})
				data.data.users = newArr;
				const newData = JSON.stringify(data);
				fs.writeFileSync('./data/data.json', newData, 'utf-8');
				return args;
			}
		},
	}
})

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {
				return data.data.users.find(user => user.id == args.id);
				// return _.find(books, {id: args.id})
			}
		},
		users: {
			type: new GraphQLList(UserType),
			resolve(parent, args) {
				return data.data.users;
			}
		},
		waste: {
			type: WasteType,
			args: { date: { type: GraphQLString } },
			resolve(parent, args) {
				let user = data.data.users.find(user => user.id == args.id);
				return user;
				// return _.find(books, {id: args.id})
			}
		},
		global: {
			type: new GraphQLList(PlasticsProductionType),
			resolve(parent, args) {
				return data.global;
			}
		},
		recycled: {
			type: new GraphQLList(RecycledType),
			resolve(parent, args) {
				return data.recycled;
			}
		},
		incinerated: {
			type: new GraphQLList(IncineratedType),
			resolve(parent, args) {
				return data.incinerated;
			}
		},
		discarded: {
			type: new GraphQLList(DiscardedType),
			resolve(parent, args) {
				return data.discarded;
			}
		},
		news: {
			type: new GraphQLList(NewsType),
			resolve(parent, args) {
				return data.news;
			}
		}
	}
})

// const schema = buildSchema(`
//     type Query {
//         users: [User],
//         user(id: String): User,
//         global: [Global],
//         discarded: [Discarded],
//         incinerated: [Incinerated],
//         recycled: [Recycled]
//     }

//     type Discarded{
//         year: String,
//         tonnes: String
//     }

//     type Incinerated{
//         year: String,
//         tonnes: String
//     }

//     type Recycled{
//         year: String,
//         tonnes: String
//     }

//     type Global {
//             year: String,
//             tonnes: String
//     }

//     type User {
//         name: String,
//         id: String,
//         waste_history: [Waste]
//     }

//     type Waste {
//         date: String,
//         amount: String,
//         type: String
//     }

//     type Mutation {
//         addWaste (date: String, amount: String, type: String): Waste
//     }
// `);

// const root = {
//     users: () => {
//         return data.data.users;
//     },
//     user: (args) => {
//         return data.data.users.find(user => user.id == args.id);
//     },
//     id: () => {
//         return data.data.users[0].id;
//     },
//     global: () => {
//         return data.global;
//     },
//     discarded: () => {
//         return data.discarded;
//     },
//     incinerated: () => {
//         return data.incinerated;
//     },
//     recycled: () => {
//         return data.recycled;
//     },
//     mutation: (args) => {

//         return
//     }
// };

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})