import LoginValidation from "../support/pageobjects/loginValidation";
const loginObjValidation: LoginValidation = new LoginValidation();
import { requestLeave, approveReject } from "../support/help";
import { addEmployee } from "../support/pageobjects/EmployeePage";
import { checkDataInTable } from "../support/Utils/checkDataInTable";
import Timesheet from "../support/pageobjects/Timesheet";

let username = `Israaaa${Math.floor((Math.random() * 1000))}`;
let password = "password123";

describe("Add Employee", () => {

    beforeEach(function () {
        cy.fixture('login').as('data')
        cy.fixture('employeeInfo').as('EmpInfo')
        cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
        //Admin login
        cy.get('@data').then((infoData: any) => {
            loginObjValidation.fillData(infoData.valid.name, infoData.valid.password)
            loginObjValidation.checkPage(infoData.valid.message)
        })
        //add Employee      
        cy.get('@EmpInfo').then(async (infoData: any) => {
            addEmployee(infoData.user.firstName, infoData.user.middleName, infoData.user.lastName, infoData.user.id, username, password)
        })
    });

    it("Add timesheet via API", () => {
        cy.logout();
        cy.get('@data').then((infoData: any) => {
            //employee login
            loginObjValidation.fillData(username, password)
            loginObjValidation.checkPage(infoData.valid.message)
        }).then(() => {
            //Add Timesheet
            Timesheet.addTimesheet("2023-11-5");
        }).then(() => {
            cy.logout();
            cy.wait(1000)
            //Admin login
            cy.get('@data').then((infoData: any) => {
                loginObjValidation.fillData(infoData.valid.name, infoData.valid.password)
                loginObjValidation.checkPage(infoData.valid.message)
            })
            // assertion the data exist in the table
            cy.get('@EmpInfo').then((infoData: any) => {
                cy.get('.oxd-sidepanel-body').contains('Time').click();
                cy.get('li.oxd-topbar-body-nav-tab.--parent.--visited span.oxd-topbar-body-nav-tab-item:contains("Timesheets")').click();
                cy.contains('Employee Timesheet').click({ force: true })
                checkDataInTable('.oxd-table', [`${infoData.user.firstName} ${infoData.user.middleName} ${infoData.user.lastName}`]);

            })

        })
    })

})
