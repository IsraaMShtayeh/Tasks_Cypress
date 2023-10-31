class Timesheet {


    static addTimesheet(date:string) {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/time/viewMyTimesheet')
        cy.api({
            method: 'GET',
            url: `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/time/timesheets/default?date=${date}`,
        }).then((response) => {
            let sheetId = response.body.data.id
            cy.api({
                method: 'PUT',
                url: `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/time/timesheets/${sheetId}/entries`,
                body: {
                    "entries": [
                        {
                            projectId: 2,
                            activityId: 11,
                            dates: {
                                "2023-11-5": { "duration": "09:00" }
                            }
                        }
                    ],
                    deletedEntries: []
                }
            }).then(() => {
                cy.api({
                    method: 'PUT',
                    url: `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/time/timesheets/${sheetId}`,
                    body: { "action": "SUBMIT" }
                })
            })
        })
    }
}

export default Timesheet