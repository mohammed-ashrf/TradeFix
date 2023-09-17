import { Component,OnInit } from '@angular/core';
import { Expense, ExpenseService } from '../services/expense.service';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  allExpenses: Expense[] = [];
  newExpense: any = {
    name: '',
    description: '',
    amount: 0
  };
  startDate!: string ;
  endDate!: string ;
  expensesSearchReasult: Expense[] = [];
  isExpensesSearched: boolean = false;
  constructor(private expenseService: ExpenseService) { }

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses(startDate?: string, endDate?: string) {
    this.expenseService.getExpenses(startDate, endDate).subscribe(
      (data) => {
        this.expenses = data;
        this.allExpenses = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  filterExpenses() {
    this.loadExpenses(this.startDate, this.endDate);
  }

  search(expenses: any[], userInput: string) {
    try {
      if (typeof userInput !== 'string') {
        console.log('User input must be a string');
        throw new Error('User input must be a string');
      }
      userInput = userInput.toLowerCase();
      return expenses.filter(expense => {
        return expense.name.toLowerCase().includes(userInput);
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  searchExpenses() {
    this.expensesSearchReasult = this.search(this.expenses, this.newExpense.name);
    this.isExpensesSearched = true;
  }

  onSelectExpense(item: Expense) {
    this.newExpense.name = item.name;
    this.isExpensesSearched = false;
  }
  
  addExpense() {
    const expense: Expense = {
      name: this.newExpense.name,
      expenses: [{ amount: this.newExpense.amount, description: this.newExpense.description,date: new Date() }]
    };
  
    this.expenseService.addExpense(expense).subscribe(
      (data) => {
        const existingExpenseIdx = this.expenses.findIndex(exp => exp.name === data.name);
        if (existingExpenseIdx !== -1) {
          this.expenses[existingExpenseIdx] = data;
        } else {
          this.expenses.push(data);
        }
        this.newExpense = {
          name: '',
          description: '',
          amount: 0
        };
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
