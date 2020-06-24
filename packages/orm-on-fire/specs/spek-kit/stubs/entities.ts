import {
    Aggregate,
    CollectionRef,
    DocRef,
    Entity,
    Field,
    ID,
    SearchField,
} from '../../../src/Decorators/Entity'
import { Reference } from '../../../src/Model/Reference'
import { GenericCollection } from '../../../src/Model/GenericCollection'


//
// Dogs collections
//

@Entity({
    collection: 'toys',
})
export class Toy {
    @ID()
    id: string

    @Field()
    type: string
}

@Entity({
    collection: 'owners',
})
export class Owner {
    @ID()
    id: string

    @Field()
    name: string
}

@Aggregate()
export class Dog {
    @ID()
    id: string

    @Field()
    name: string

    @Field()
    age: number

    @DocRef(Owner)
    owner: Reference<Owner>

    @CollectionRef(Toy)
    toys: GenericCollection<Toy>
}

//
// User collections
//

@Entity()
export class User {
    @ID()
    id: string

    @Field()
    name: string
}


//
// Car collections
//

@Entity()
export class Engine {
    @ID()
    id: string

    @Field()
    fuelType: string = 'gas'
}


@Entity()
export class Car {
    @ID()
    id: string

    @Field()
    name: string

    @Field()
    mileage: number

    @DocRef(Engine)
    engine: number
}

//
// Books collections
//

@Entity()
export class Book {
    @ID()
    id: string

    @SearchField()
    name: string
}

