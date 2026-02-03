import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Text from '../Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TrackingStatus } from '../../types/tracking';

interface StatusTimelineProps {
  timeline: TrackingStatus[];
  currentStatus: string;
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({
  timeline,
  currentStatus,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.heading }]}>
        {t('tracking.statusTimeline')}
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.timelineContent}
      >
        {timeline.map((status, index) => {
          const isLast = index === timeline.length - 1;
          const isCompleted = status.isCompleted || status.isCurrent;
          const isCurrent = status.isCurrent;

          return (
            <View key={status.id} style={styles.timelineItem}>
              {/* Линия между статусами */}
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor: isCompleted
                        ? theme.primary
                        : theme.border,
                    },
                  ]}
                />
              )}

              {/* Иконка статуса */}
              <View
                style={[
                  styles.statusIcon,
                  {
                    backgroundColor: isCompleted
                      ? status.color
                      : theme.card,
                    borderColor: isCompleted
                      ? status.color
                      : theme.border,
                  },
                  isCurrent && styles.currentStatusIcon,
                ]}
              >
                <Ionicons
                  name={status.icon as any}
                  size={20}
                  color={isCompleted ? '#FFFFFF' : theme.textSecondary}
                />
                {isCurrent && (
                  <View style={[styles.pulseRing, { borderColor: status.color }]} />
                )}
              </View>

              {/* Информация о статусе */}
              <View style={styles.statusInfo}>
                <View style={styles.statusHeader}>
                  <Text style={[styles.statusName, { color: theme.text }]}>
                    {status.name}
                  </Text>
                  <Text style={[styles.statusTime, { color: theme.textSecondary }]}>
                    {formatTime(status.timestamp)}
                  </Text>
                </View>

                <Text style={[styles.statusDescription, { color: theme.textSecondary }]}>
                  {status.description}
                </Text>

                {status.location && (
                  <View style={styles.locationContainer}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={theme.textSecondary}
                    />
                    <Text style={[styles.locationText, { color: theme.textSecondary }]}>
                      {status.location}
                    </Text>
                  </View>
                )}

                {/* Время выполнения */}
                <View style={styles.durationContainer}>
                  {status.estimatedDuration && (
                    <View style={styles.durationItem}>
                      <Text style={[styles.durationLabel, { color: theme.textSecondary }]}>
                        {t('timeline.estimatedTime')}:
                      </Text>
                      <Text style={[styles.durationValue, { color: theme.text }]}>
                        {status.estimatedDuration}h
                      </Text>
                    </View>
                  )}

                  {status.actualDuration && (
                    <View style={styles.durationItem}>
                      <Text style={[styles.durationLabel, { color: theme.textSecondary }]}>
                        {t('timeline.actualTime')}:
                      </Text>
                      <Text
                        style={[
                          styles.durationValue,
                          {
                            color: status.actualDuration > (status.estimatedDuration || 0)
                              ? theme.error
                              : theme.secondary,
                          },
                        ]}
                      >
                        {status.actualDuration}h
                        {status.actualDuration > (status.estimatedDuration || 0) && (
                          <Text style={[styles.durationNote, { color: theme.error }]}>
                            {' '}(+{status.actualDuration - (status.estimatedDuration || 0)}h)
                          </Text>
                        )}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Дата */}
                <Text style={[styles.statusDate, { color: theme.textSecondary }]}>
                  {formatDate(status.timestamp)}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  timelineContent: {
    paddingBottom: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
    position: 'relative',
  },
  line: {
    position: 'absolute',
    top: 40,
    left: 19,
    width: 2,
    height: 300, // Используем фиксированное значение вместо calc
    zIndex: 0,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    zIndex: 1,
  },
  currentStatusIcon: {
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 24,
    borderWidth: 2,
    opacity: 0.4,
    zIndex: -1,
  },
  statusInfo: {
    flex: 1,
    paddingTop: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  statusName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  statusTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  durationItem: {
    flex: 1,
  },
  durationLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  durationValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  durationNote: {
    fontSize: 11,
    fontWeight: '500',
  },
  statusDate: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default StatusTimeline;