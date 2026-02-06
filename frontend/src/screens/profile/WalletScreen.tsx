import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  Shadow,
} from '../../utils/theme';
import { currentUser, mockTransactions } from '../../utils/mockData';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../components/Button';

export default function WalletScreen({ navigation }: any) {
  const handleAddFunds = () => {
    Alert.alert('Add Funds', 'UPI payment integration coming soon!');
  };

  const renderTransaction = ({ item }: { item: typeof mockTransactions[0] }) => {
    const isCredit = item.type === 'credit';

    return (
      <View style={styles.txItem}>
        <View
          style={[
            styles.txIcon,
            { backgroundColor: (isCredit ? Colors.success : Colors.error) + '12' },
          ]}
        >
          <Ionicons
            name={isCredit ? 'arrow-down' : 'arrow-up'}
            size={18}
            color={isCredit ? Colors.success : Colors.error}
          />
        </View>
        <View style={styles.txContent}>
          <Text style={styles.txDescription}>{item.description}</Text>
          {item.taskTitle && (
            <Text style={styles.txTask}>{item.taskTitle}</Text>
          )}
          <Text style={styles.txDate}>{item.createdAt}</Text>
        </View>
        <View style={styles.txRight}>
          <Text
            style={[
              styles.txAmount,
              { color: isCredit ? Colors.success : Colors.error },
            ]}
          >
            {isCredit ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
          <Text
            style={[
              styles.txStatus,
              {
                color:
                  item.status === 'completed'
                    ? Colors.success
                    : item.status === 'pending'
                    ? Colors.warning
                    : Colors.error,
              },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceTop}>
          <Ionicons name="wallet" size={28} color={Colors.primary} />
          <Text style={styles.balanceLabel}>Available Balance</Text>
        </View>
        <Text style={styles.balanceAmount}>
          {formatCurrency(currentUser.walletBalance)}
        </Text>
        <View style={styles.balanceActions}>
          <Button
            title="Add Funds"
            onPress={handleAddFunds}
            size="md"
            icon={<Ionicons name="add" size={18} color="#FFFFFF" />}
            fullWidth={false}
            style={{ flex: 1 }}
          />
          <Button
            title="Withdraw"
            onPress={() => Alert.alert('Withdraw', 'Coming soon!')}
            variant="outline"
            size="md"
            fullWidth={false}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* Transactions */}
      <Text style={styles.sectionTitle}>Transaction History</Text>
      <FlatList
        data={mockTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.txList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    ...Shadow.sm,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  balanceCard: {
    backgroundColor: Colors.card,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadow.md,
  },
  balanceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  balanceLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  txList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  txDescription: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  txTask: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    marginTop: 1,
  },
  txDate: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  txStatus: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    marginTop: 2,
    textTransform: 'capitalize',
  },
});
