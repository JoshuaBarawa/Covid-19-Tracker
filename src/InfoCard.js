
import React from 'react'
import {Card, CardContent, Typography} from '@mui/material'
import './infocard.css'

function InfoCard({title, cases, active, total, ...props}) {
    return (
       
        <Card className={`infoCard ${active && "infoCard--selected"}`}>
            <CardContent>
                <Typography className="info__title" color="textSecondry">{title}</Typography>
                <h3 className="info__cases">{cases}</h3>
                <Typography className="info__total" color="textSecondry"> Total: {total}</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoCard
