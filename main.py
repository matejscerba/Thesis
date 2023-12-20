from data_loader import DataLoader

if __name__ == "__main__":
    df = DataLoader.load()
    print(df.head(5))
