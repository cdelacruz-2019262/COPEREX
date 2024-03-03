'use strict'

import Company from './company.model.js'
import ExcelJS  from 'exceljs';

//probar la funcionalidad
export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

export const register = async (req, res) => {
    try {
        let data = req.body
        let exist = await Company.findOne({
            $or: [
                { name: data.name },
                { email: data.email }
            ]
        })
        if (exist) return res.send({ message: 'name or email already exist' })
        let company = new Company(data)
        await company.save()
        return res.send({ message: `Registered successfully, can be logged with name ${company.name}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering company', err: err })
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let updatedCompany = await Company.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        //Validar la actualización
        if (!updatedCompany) return res.status(401).send({ message: 'Company not found and not updated' })
        //Respondo al usuario
        return res.send({ message: 'Updated company', updatedCompany })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating account' })
    }
}



export const sortAZ = async (req, res) => {
    try {
        let az = await Company.find().sort({ name: 1 });
        return res.send(az)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error finding and sorting companies' })
    }
}

export const sortZA = async (req, res) => {
    try {
        let za = await Company.find().sort({ name: -1 });
        return res.send(za)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error finding and sorting companies' })
    }
}

export const sortNovelty = async (req, res) => {
    try {
        let antiquity = await Company.find().sort({ inauguration: -1 });
        return res.send(antiquity)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error finding and sorting companies' })
    }
}

export const sortAntiquity = async (req, res) => {
    try {
        let antiquity = await Company.find().sort({ inauguration: 1 });
        return res.send(antiquity)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error finding and sorting companies' })
    }
}

export const excelTable = async (req, res) => {
    try {
        const get = await Company.find();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Empresas');

        worksheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Impact Level', key: 'impact', width: 25 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Inauguratión', key: 'inauguration', width: 15 },
            { header: 'Category', key: 'category', width: 20 },
        ];

        get.forEach(company => {
            worksheet.addRow({
                name: company.name,
                impact: company.impactLevel,
                email: company.email,
                phone: company.phone,
                inauguration: company.inauguration,
                category: company.category,
            });
        });

        await workbook.xlsx.writeFile('./src/company/reports/company.xlsx');

        return res.send({ message: 'Datos exportados a company.xlsx correctamente.'});
    } catch (err) {
        return res.status(500).send({ message: 'Error al exportar empresas a Excel:', err:err })
    }
};