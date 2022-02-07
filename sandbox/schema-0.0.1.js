const baseSchema = {
    timestamps: true, // createdAt, updatedAt
    __v: 1,
    isInActive: true,
    isDeleted: false,
}

const PackageDetails = {
    customerId: ObjectId,
    receipientId: ObjectId | null,
    address: {
        city: String,
        country: String,
        streetAddress: String,
        zoneId: ObjectId,
        areaId: ObjectId,
    }
}

const Subscription = {
    planType: String,
    validityDays: Number,
    startDate: Date,
    endDate: Date,
}

const customer = {
    emailAddress: String,
    username: String,
    isInActive: Boolean,
    firstName: String,
    lastName: String,
    company: String, // not required
    profession: String, // not required,
    subscription: Subscription,
    password: String,
    role: String,
};

const warehouse = {
    name: String,
    zoneId: ObjectId,
    location: String,
}

const zone = {
    name: String,
    identifier: String,
    city: String,
    country: String,
}

const areas = {
    name: String,
    identifier: String,
    zoneId: ObjectId,
    parentId: ObjectId | null,
    parentName: String,
}

const transportation = {
    name: String,
    type: ['truck', 'motorcycle'],
    description: String,
    warehouse: ObjectId,
    identifier: String, //vehicle Number
    owner : String,
    status: [
        'to-port',
        'from-port-empty',
        'from-port-loaded',
        'stalled',
        'staged-at-warehouse',
    ]
}
