const { faker } = require("@faker-js/faker");
const geoCode = require("../../services/geoCode");
const jobTypeOptions = ['full-time', 'part-time', 'contract', 'freelance', 'internship']
const jobCategoryOptions = ['remote', 'hybrid', 'on-site' ]
const statusOptions = ['offer received', 'interview', 'declined', 'pending']

const getJobType = () => {
    return jobTypeOptions[Math.floor(Math.random() * jobTypeOptions.length)]
}

const getJobCategory = () => {
    return jobCategoryOptions[Math.floor(Math.random() * jobCategoryOptions.length)]
}

const getJobStatus = () => {
    return statusOptions[Math.floor(Math.random() * statusOptions.length)]
}

const getJobDescription = () => {
    let description = faker.person.jobTitle()
    do {
        description = faker.person.jobTitle()
    } while (description.length > 15)
    return description
}

const getCompanyName = () => {
    let company = faker.company.name()
    do {
        company = faker.company.name()
    } while (company.length > 15)
    return company
}

const jobAddresses = [
    'Valletta Malta',
    'Paros Greece',
    'Santorini Greece',
    'Mykonos Greece',
    'Athens Greece',
    'Thessaloniki Greece',
    'Chania Greece',
    'Heraklion Greece',
    'Zakynthos Greece',
    'Kefalonia Greece',
    'Rhodes Greece',
    'Corfu Greece',
    'Madrid Spain',
    'Alicante Spain',
    'Barcelona Spain',
    'Valencia Spain',
    'Palma de Mallorca Spain',
    'Las Palmas de Gran Canaria Spain',
    'Ibiza Spain',
    'Fuerteventura Spain',
    'Tenerife Spain',
    'Malaga Spain',
    'Seville Spain',
    'Granada Spain',
    'Lisbon Portugal'
]

const getRandomJob = async (userId, address) => {
    return {
        createdBy: userId,
        createdAt: faker.date.past().toISOString(),
        description: getJobDescription(),
        company: getCompanyName(),
        jobType: getJobType(),
        jobCategory: getJobCategory(),
        status: getJobStatus(),
        location: {
            address: address,
            coordinates: await geoCode(address)
        }
    }
}

module.exports = { jobAddresses, getRandomJob }
