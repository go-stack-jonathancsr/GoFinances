/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
  formattedIncome: string;
  formattedOutcome: string;
  formattedTotal: string;
}

interface TransactionResponse {
  balance: Balance;
  transactions: Transaction[];
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get<TransactionResponse>('/transactions');

      const transactionsParsed = response.data.transactions.map(transaction => {
        transaction.formattedValue = formatValue(transaction.value);
        transaction.formattedDate = new Date(
          transaction.created_at,
        ).toLocaleDateString('pt-br');
        return transaction;
      });

      const balanceParsed = response.data.balance;
      balanceParsed.formattedIncome = formatValue(balanceParsed.income);
      balanceParsed.formattedOutcome = formatValue(balanceParsed.outcome);
      balanceParsed.formattedTotal = formatValue(balanceParsed.total);

      setTransactions(transactionsParsed);
      setBalance(balanceParsed);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            {balance && (
              <h1 data-testid="balance-income">{balance.formattedIncome}</h1>
            )}
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            {balance && (
              <h1 data-testid="balance-outcome">{balance.formattedOutcome}</h1>
            )}
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            {balance && (
              <h1 data-testid="balance-total">{balance.formattedTotal}</h1>
            )}
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => {
                return (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.type === 'outcome' && ' - '}
                      {transaction.formattedValue}
                    </td>

                    <td>{transaction.category.title}</td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
