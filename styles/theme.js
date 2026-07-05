export const COLORS = {
  primary: "#4A90E2",
  primaryDark: "#357ABD",
  secondary: "#4CAF50",
  background: "#F5F7FA",
  cardBackground: "#FFFFFF",
  text: "#2D3436",
  subtext: "#7F8C8D",
  border: "#E0E0E0",
  error: "#E74C3C",
};

export const globalStyles = {
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    backgroundColor: "#FAFAFA",
    fontSize: 15,
  },
  error: {
    color: COLORS.error,
    marginBottom: 12,
    textAlign: "center",
    fontSize: 13,
  },
  link: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },
};
